import React, { useState, useEffect } from 'react';
import { getEmployeeListByAbsentRequests, getAbsenceRequests, fetchListOfUsers, UpdateStatusForAbsentRequest } from '../authService/PrivateAuthService';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Import React Bootstrap Modal
import '../styles/userlist.css';

const AbsenceRequest = () => {
  const token = localStorage.getItem('token');
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueEmployees, setUniqueEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);  // State for the selected user
  const [absenceRequests, setAbsenceRequests] = useState([]); // State to store absence requests
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [approvalStatus, setApprovalStatus] = useState(null);  // State for approval status
  const [isEmployeeDataLoaded, setIsEmployeeDataLoaded] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 10;

  useEffect(() => {
    console.log('useEffect');
    if (isEmployeeDataLoaded) {
      return; // Exit early if the employee data has already been loaded
    }

    const currentMonth = new Date().getMonth() + 1;
    getEmployeeListByAbsentRequests(currentMonth)
      .then((employeeList) => {
        // Check if no data was received
        if (!employeeList.data || employeeList.data.length === 0) {
          console.error('No employee data received');
          // Set userDetails as empty array
          setIsLoading(false); // Stop the loading state
          setIsEmployeeDataLoaded(true);// Set the flag to true to prevent further execution
          return; // Exit early
        }

        // Filter unique employees based on employeeId
        const uniqueEmployeeList = Object.values(
          employeeList.data.reduce((acc, employee) => {
            if (!acc[employee.employeeId]) {
              acc[employee.employeeId] = employee; // Add employee if not already added
            }
            return acc;
          }, {})
        );

        // Set the filtered employee list with unique employeeIds
        setUniqueEmployees(uniqueEmployeeList);

        // Get the unique employeeIds immediately from uniqueEmployeeList
        const employeeIds = uniqueEmployeeList.map((employee) => employee.employeeId);

        if (employeeIds.length === 0) {
          // Set userDetails as empty array when no employeeIds are found
          setIsLoading(false); // Stop the loading state
          setIsEmployeeDataLoaded(true); // Set the flag to true to prevent further execution
          return; // Exit early and skip the API call
        }

        // Directly pass employeeIds to fetchListOfUsers
        fetchListOfUsers(employeeIds) // Pass the employeeIds array here directly
          .then((response) => {
            if (response.data && response.data.length > 0) {
              setUserDetails(response.data); // Set fetched absence requests
            } else {
              setUserDetails([]); // No absence requests for these users in this month
            }
            setIsEmployeeDataLoaded(true); // Set the flag to true after successful loading
          })
          .catch((error) => {
            console.error('Error fetching absence requests:', error);
            setUserDetails([]); // Clear absence requests if error occurs
            setIsEmployeeDataLoaded(true); // Set the flag to true after error
          });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Stop the loading state
        setIsEmployeeDataLoaded(true); // Set the flag to true after error
      });
  }, [isEmployeeDataLoaded, userDetails]); // Empty dependency array, so it runs only once when the component mounts



  const handleRowClick = (user) => {
    setSelectedUser(user);  // Set the clicked user details
    setApprovalStatus(null); // Reset the approval status
    setShowModal(true); // Show the modal

    // Fetch absence requests for this user
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    fetchAbsenceRequests(user.id, currentMonth);
  };

  const fetchAbsenceRequests = (userId, month) => {
    getAbsenceRequests(userId, month)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setAbsenceRequests(response.data); // Set fetched absence requests
        } else {
          setAbsenceRequests([]); // No absence requests for this user in this month
        }
      })
      .catch((error) => {
        console.error('Error fetching absence requests:', error);
        setAbsenceRequests([]); // Clear absence requests if error occurs
      });
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleApprove = (date) => {
    setApprovalStatus(`Approved for ${date}`);
    // Remove the rejected request from the absenceRequests array
    const updatedRequests = absenceRequests.filter((request) => request.attendanceDate !== date);
    console.log('Updated Absence Requests after removal:', updatedRequests);

    if (updatedRequests.length === 0) {
      const updatedUserDetails = userDetails.filter((user) => user.id !== selectedUser.id);
      setUserDetails(updatedUserDetails); // Clear the userDetails if no requests are left
    }

    setAbsenceRequests(updatedRequests);
    UpdateStatusForAbsentRequest(selectedUser.id, date, 'Approved')
      .then((response) => {
        console.log(`Absence request for ${selectedUser.firstName} ${selectedUser.lastName} on ${date} approved and status updated.`);
      })
      .catch((error) => {
        console.error('Error updating absence request status:', error);
      });// Additional logic for approval, e.g., send request to the backend
    console.log(`Absence request for ${selectedUser.firstName} ${selectedUser.lastName} on ${date} approved.`);
  };

  const handleReject = (date) => {
    setApprovalStatus(`Rejected for ${date}`);
    const updatedRequests = absenceRequests.filter((request) => request.attendanceDate !== date);
    console.log('Updated Absence Requests after removal:', updatedRequests);

    if (updatedRequests.length === 0) {
      const updatedUserDetails = userDetails.filter((user) => user.id !== selectedUser.id);
      setUserDetails(updatedUserDetails); // Clear the userDetails if no requests are left
    }

    setAbsenceRequests(updatedRequests);
    UpdateStatusForAbsentRequest(selectedUser.id, date, 'Rejected')
      .then((response) => {
        console.log(`Absence request for ${selectedUser.firstName} ${selectedUser.lastName} on ${date} rejected and status updated.`);
      })
      .catch((error) => {
        console.error('Error updating absence request status:', error);
      });
    // Additional logic for rejection, e.g., send request to the backend
    console.log(`Absence request for ${selectedUser.firstName} ${selectedUser.lastName} on ${date} rejected.`);
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userDetails.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-box clearfix">
              <h3>Absent Requests</h3>
              <div className="table-responsive">
                <table className="table user-list">
                  <thead>
                    <tr>
                      <th><span>User</span></th>
                      <th className="text-center"><span>Status</span></th>
                      <th><span>Email</span></th>
                      <th><span>Department</span></th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers &&
                      currentUsers.map((user, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <img
                              src={`https://bootdey.com/img/Content/avatar/avatar${(index % 8) + 1}.png`}
                              alt=""
                            />
                            <span className="user-name">
                              {user.firstName} {user.lastName}
                            </span>
                            <br />
                            <span className="user-subhead">Admin</span>
                          </td>
                          <td className="text-center">
                            <span className="label label-default">
                              {getStatusText(user.isActive)}
                            </span>
                          </td>
                          <td>
                            <a href="#">{user.username}</a>
                          </td>
                          <td>
                            <span>{user.department}</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <ul className="pagination pull-right">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>
                    <i className="fa fa-chevron-left"></i>
                  </a>
                </li>
                {Array.from({ length: Math.ceil(userDetails.length / usersPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => paginate(i + 1)}>
                      {i + 1}
                    </a>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === Math.ceil(userDetails.length / usersPerPage) ? 'disabled' : ''
                    }`}
                >
                  <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>
                    <i className="fa fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to show selected user details */}
      {selectedUser && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser.firstName} {selectedUser.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Email:</strong> {selectedUser.username}</p>
            <p><strong>Status:</strong> {getStatusText(selectedUser.isActive)}</p>
            <p><strong>Department:</strong> {selectedUser.department}</p>
            <p><strong>Absent Requests:</strong></p>

            {/* Displaying the absent request dates and approval/reject buttons inline with more space */}
            {absenceRequests && absenceRequests.length > 0 ? (
              absenceRequests.map((request, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <p className="mr-4" style={{ width: '150px' }}>
                    <strong>Date:</strong> {formatDate(request.attendanceDate)}
                  </p>

                  {/* Button group with more spacing between them */}
                  <div>
                    <Button
                      variant="success"
                      onClick={() => handleApprove(request.attendanceDate)}
                      className="mr-4 px-4 py-2"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(request.attendanceDate)}
                      className="px-4 py-2"  // Padding to make button size consistent
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No absence requests for this user in the current month.</p>
            )}

            {/* Display approval status */}
            {approvalStatus && <p><strong>Approval Status:</strong> {approvalStatus}</p>}
          </Modal.Body>


          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AbsenceRequest;
