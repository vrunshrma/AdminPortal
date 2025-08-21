import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/calendarComponent.css';
import { useAuth } from '../authService/AuthContext';
import { addAttendance, deleteAttendance, updateAttendance, fetchEventDetailsForDate, fetchEventDetailsForMonth } from '../authService/PrivateAuthService'; // Add deleteAttendance function

const localizer = momentLocalizer(moment);

const AttendanceCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null); // New state to track selected event
  const [refresh, setRefresh] = useState(false);
  const userDetailsObj = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(userDetailsObj);

  const { user } = useAuth(); // Use the user object from the AuthContext
  console.log('User Details from caledar : ', user);
  console.log('User ID : ', user?.id);

  useEffect(() => {
    const updateView = (view) => {
      setView(view);
      if (view === "month") {
        // For month view, set the current date to the first day of the month
        setCurrentDate(moment().startOf("month"));
        console.log("Current Date:", moment().startOf("month"));
      } else if (view === "week") {
        // For day view, set current date to today's date
        setCurrentDate(moment().startOf("week"));
        console.log("Current Date:", moment().startOf("week"));
      }
      // Add other view changes if necessary
    };

    const handleViewChange = (e) => {
      if (e.target && e.target.classList.contains("rbc-btn")) {
        updateView(e.target.getAttribute("aria-label").toLowerCase());
      }
    };

    const toolbar = document.querySelector(".rbc-toolbar .rbc-btn-group");
    if (toolbar) {
      toolbar.addEventListener("click", handleViewChange);
    }

    const attendanceMonth = currentDate.month() + 1;  // Months are 0-indexed, so add 1
    const attendanceYear = currentDate.year();
    //console.log("Fetching events for", attendanceYear, attendanceMonth);
    fetchEventDetailsForMonth(attendanceMonth, attendanceYear, user?.id)
      .then((response) => {
        console.log("Fetched Attendance Data:", response.data);
        if (response.data) {
          // Map the events data into a format that your calendar can understand
          setEvents(response.data.map(event => {
            const eventStartDate = moment(event.attendanceDate); // Convert to moment object for easier manipulation
            if (event.attendanceStatus === 'Absent') {
              return {
                start: eventStartDate.toDate(),  // Start time as a JavaScript Date object
                end: eventStartDate.add(1, 'hour').toDate(),  // Add default 1 hour for end time, can be adjusted
                title: event.attendanceStatus, // Customize the title based on your data
                status: event.status,
                id: event.attendanceId,
                checkIn: event.checkIn,
                checkOut: event.checkOut,
                date: eventStartDate.format('YYYY-MM-DD'), // Store the date in a readable format
              };
            } else {
              return {
                start: eventStartDate.toDate(),  // Start time as a JavaScript Date object
                end: eventStartDate.add(1, 'hour').toDate(),  // Add default 1 hour for end time, can be adjusted
                title: `${event.attendanceStatus} at ${event.checkIn}`, // Customize the title based on your data
                status: event.attendanceStatus,
                id: event.attendanceId,
                checkIn: event.checkIn,
                checkOut: event.checkOut,
                date: eventStartDate.format('YYYY-MM-DD'), // Store the date in a readable format
              };
            }
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });

    return () => {
      if (toolbar) {
        toolbar.removeEventListener("click", handleViewChange);
      }
    };

  }, [currentDate, refresh]);

  const handleNavigate = (date) => {
    setCurrentDate(moment(date));
  };

  const handleSelectSlot = ({ start, end }) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    const now = moment(); // Get the current date and time

    // Handle past time/date validation
    if (view === "week" && startMoment.isBefore(now, 'minute')) {
      alert("You cannot mark attendance for past time in week view.");
      return;
    } else if (view === "month" && startMoment.isBefore(now, 'day')) {
      alert("You cannot mark attendance for a previous day in month view.");
      return;
    }

    // If the user is marking today's date in month view, set the current time for the event
    if (view === "month" && startMoment.isSame(now, 'day')) {
      // If the selected date is today, set the time to the current time
      startMoment.set({
        'hour': now.hour(),
        'minute': now.minute(),
        'second': now.second(),
        'millisecond': now.millisecond()
      });

      // The end time can be calculated similarly, or you can set it based on your needs (e.g., 1 hour later)
      endMoment.set({
        'hour': now.hour(),
        'minute': now.minute(),
        'second': now.second(),
        'millisecond': now.millisecond()
      }).add(1, 'hour'); // Adding 1 hour to the start time (you can customize this)

      // Log the time to verify
      console.log("Selected Slot with Current Time:", { start: startMoment.toDate(), end: endMoment.toDate() });
    } else if (view === "month") {
      startMoment.set({
        'hour': now.hour(),
        'minute': now.minute(),
        'second': now.second(),
        'millisecond': now.millisecond()
      });

      // The end time can be calculated similarly, or you can set it based on your needs (e.g., 1 hour later)
      endMoment.set({
        'hour': now.hour(),
        'minute': now.minute(),
        'second': now.second(),
        'millisecond': now.millisecond()
      }).add(1, 'hour');
    }

    // Convert moment objects to Date objects for compatibility with the calendar
    const startDate = startMoment.toDate();
    const endDate = endMoment.toDate();

    // Log selected slot for debugging
    console.log("Selected Slot:", { start: startDate, end: endDate });

    setSelectedSlot({ start: startDate, end: endDate });
    setShowModal(true); // Open the modal to mark attendance
  };

  // Function to handle attendance selection (Present, Absent, Meeting)

  const handleAttendanceSelection = (status) => {
    if (!selectedSlot) return;

    const attendanceDate = moment(selectedSlot.start).format('YYYY-MM-DD');
    const checkIn = moment(selectedSlot.start).format('HH:mm:ss'); // Format the start time
    const shift = moment(selectedSlot.end).format('YYYY-MM-DD');
    const checkOut = moment(selectedSlot.end).format('HH:mm:ss');
    const year = moment(selectedSlot.start).year();

    const attendanceData = {
      employeeId: user?.id,
      attendanceStatus: status,
      attendanceDate,
      checkIn,
      shift,
      checkOut,
      year,
    };

    console.log("Attendance Data:", attendanceData); // Log the data being sent

    fetchEventDetailsForDate(attendanceDate, user?.id)
      .then((response) => {
        console.log('Attendance Details:', response.data);
        if (response.data) {
          // If data is returned (event already exists), update the attendance
          const existingData = response.data;  // Assuming the first result is the event to update

          // Prepare updated attendance data
          const updatedAttendanceData = {
            ...existingData, // Copy existing data
            attendanceStatus: status, // Update status
            checkIn: moment(selectedSlot.start).format('HH:mm:ss'),                   // Update check-in time
            checkOut: moment(selectedSlot.end).format('HH:mm:ss'),              // Update check-out time
            shift,                     // Update shift time
          };

          const updatedEvent = {
            start: selectedSlot.start,  // New start time
            end: selectedSlot.end,      // New end time
            title: `${status} at ${moment(selectedSlot.start).format('HH:mm:ss')}`, // Updated title
            status: updatedAttendanceData.status,             // Updated status
            id: existingData.attendanceId, // Keep the same event ID
            checkIn: updatedAttendanceData.checkIn,  // Updated check-in
            checkOut: updatedAttendanceData.checkOut, // Updated check-out
          };

          if (status === 'Absent') {
            updatedEvent.title = `${status}`;
          }

          // Set the events state to the updated event
          // setEvents([updatedEvent]); // Replace the state with the updated event

          updateAttendance(updatedAttendanceData)
            .then((updateResponse) => {
              console.log('Attendance successfully updated:', updateResponse.data);
              setRefresh(prev => !prev);
              // Update events in the state with the updated data
              setShowModal(false); // Close the modal
              if (events.title === 'Present') {
                setEvents((prevEvents) => {
                  return prevEvents.map((event) =>
                    event.id === updateResponse.data.attendanceId // Find the event to update
                      ? {
                        ...event, // Copy the old event properties
                        title: `${status} at ${moment(selectedSlot.start).format('HH:mm:ss')}`, // Update title with new status
                        start: selectedSlot.start,  // Update start time
                        end: selectedSlot.end,      // Update end time
                        status,                     // Update status
                      }
                      : event // Keep other events unchanged
                  );
                });
              } else {
                setEvents((prevEvents) => {
                  return prevEvents.map((event) =>
                    event.id === updateResponse.data.attendanceId // Find the event to update
                      ? {
                        ...event, // Copy the old event properties
                        title: `${status}`, // Update title with new status
                        start: selectedSlot.start,  // Update start time
                        end: selectedSlot.end,      // Update end time
                        status,                     // Update status
                      }
                      : event // Keep other events unchanged
                  );
                });
              }

            })
            .catch((error) => {
              console.error('Error updating attendance:', error);
            });
        } else {
          // If no data is found, add a new attendance entry
          const attendanceData = {
            employeeId: user?.id,
            attendanceStatus: status,
            attendanceDate: moment(selectedSlot.start).format('YYYY-MM-DD'),
            checkIn,
            shift,
            checkOut,
            status,
            year: moment(selectedSlot.start).year(),
            month: moment(selectedSlot.start).month() + 1, // Months are 0-indexed, so add 1
          };

          if (status === 'Absent') {
            attendanceData.status = 'Pending';  // Set status to 'Pending' if the status is 'Absent'
          }
          console.log('Adding new attendance:', attendanceData);


          addAttendance(attendanceData)
            .then((addResponse) => {
              console.log('Attendance successfully marked:', addResponse.data);
              setRefresh(prev => !prev);
              // Add the new event to the events state
              if (status === 'Present') {
                setEvents((prevEvents) => [
                  ...prevEvents,
                  {
                    start: selectedSlot.start,
                    end: selectedSlot.end,
                    title: `${status} at ${moment(selectedSlot.start).format('HH:mm:ss')}`,
                    status,
                    id: addResponse.data.attendanceId, // Assuming the response contains the event ID
                  },
                ]);
              } else {
                setEvents((prevEvents) => [
                  ...prevEvents,
                  {
                    start: selectedSlot.start,
                    end: selectedSlot.end,
                    title: `${status}`,
                    status,
                    id: addResponse.data.attendanceId, // Assuming the response contains the event ID
                  },
                ]);
              }

              setShowModal(false); // Close the modal
            })
            .catch((error) => {
              console.error('Error marking attendance:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching attendance details:', error);
      });
  };

  // Handle event click to edit or delete
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event to the clicked event
    const { start, end } = event; // Get the start and end times of the event

    // Manually trigger handleSelectSlot with the start and end times
    handleSelectSlot({ start, end });
    const startMoment = moment(start);

    const now = moment(); // Get the current date and time

    // Handle past time/date validation
    if (view === "week" && startMoment.isBefore(now, 'minute')) {
      //alert("You cannot mark attendance for past time in week view.");
      return;
    } else if (view === "month" && startMoment.isBefore(now, 'day')) {
      //alert("You cannot mark attendance for a previous day in month view.");
      return;
    }
    setShowModal(true); // Open the modal to edit
  };

  // Handle deletion of an attendance event
  const handleDeleteAttendance = () => {
    if (!selectedEvent) return;
    console.log('userDetails ID :', userDetails.id);
    const start = selectedSlot.start;
    const fullDate = moment(start).format("YYYY-MM-DD");
    console.log('Present Events in the Events array :', events);
    // Delete the event from the backend
    deleteAttendance(userDetails.id, start.getFullYear(), start.getMonth() + 1, fullDate)
      .then(() => {
        // Remove the event from the UI
        console.log('Selected Event ID:', selectedEvent.id);
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.filter(e => {
            console.log('Event ID:', e.id, 'Selected Event ID:', selectedEvent.id); // Debugging each event

            if (e.id === selectedEvent.id) {
              console.log('Match Found: Removing Event ID:', e.id);
              return false; // Exclude this event
            } else {
              console.log('No Match: Keeping Event ID:', e.id);
              return true; // Include this event
            }
          });
          console.log('Events after deletion:', updatedEvents); // This logs the correct updated array
          setSelectedEvent(null);
          return updatedEvents;
        });
        setShowModal(false); // Close the modal after deletion
      })
      .catch(error => {
        console.error('Error deleting attendance:', error);
      });
  };

  // const CustomEvent = ({ event }) => {
  //   return (
  //     <div>
  //       {/* Title (attendance status) */}
  //       <div style={{ fontSize: "16px", fontWeight: "bold" }}>{event.title}</div>
  //       {/* Additional Field (status) */}
  //       <div style={{ fontSize: "12px", color: "#322e2e" }}>{event.status}</div>
  //     </div>
  //   );
  // };

  const CustomEvent = ({ event }) => {
    if (event.status === 'Present') {
      return (
        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
          {event.title} {/* Display only the title */}
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            {event.title} {/* Display only the title */}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            {event.status} {/* Display only the title */}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="cal_container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onView={(newView) => setView(newView)}
        onSelectEvent={handleEventClick} // Allow event editing
        min={view === 'week' ? moment() : undefined}
        max={view === 'month' ? moment().endOf('day') : undefined}
        onNavigate={handleNavigate}
        components={{
          event: CustomEvent, // Pass CustomEvent as the event renderer
        }}
        eventPropGetter={(event) => {
          let backgroundColor = '#3174ad'; // Default color

          if (event.title === 'Absent' && event.status === 'Rejected') {
            backgroundColor = 'red';
          }

          return {
            style: { backgroundColor, color: 'white' }, // Ensures text is visible
          };
        }}
      />


      {/* Modal for selecting attendance status */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Attendance' : 'Mark Attendance'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedEvent ? `Edit Attendance for ${selectedEvent.title}` : 'Mark Attendance'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {view === "month" && selectedSlot && !moment(selectedSlot.start).isSame(moment(), 'day') ? (
                // Show only "Absent" and "Meeting" options for non-current dates in month view
                <>
                  <Dropdown.Item onClick={() => handleAttendanceSelection('Absent')}>Absent</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleAttendanceSelection('Meeting')}>Meeting</Dropdown.Item>
                </>
              ) : (
                // Show all options for current date
                <>
                  <Dropdown.Item onClick={() => handleAttendanceSelection('Present')}>Present</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleAttendanceSelection('Absent')}>Absent</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleAttendanceSelection('Meeting')}>Meeting</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          {(
            <Button variant="danger" onClick={handleDeleteAttendance}>
              Delete Attendance
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AttendanceCalendar;
