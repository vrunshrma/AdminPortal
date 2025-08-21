import React from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "../styles/slidePanel.css";
import { useNavigate } from "react-router-dom";

const SlidePanelComponent = ({ isOpen, togglePanel }) => {
  const navigate = useNavigate();

  return (
    <SlidingPane
      isOpen={isOpen}
      title="Menu"
      from="left"
      width="250px"
      onRequestClose={togglePanel}
    >
      <ul className="slide-panel-menu">
        <li onClick={() => navigate("/employeeDashboard")} className="nav-link">Dashboard</li>
        <li onClick={() => navigate("/employeeList")} className="nav-link">EmployeeList</li>
        <li onClick={() => navigate("/calendar")} className="nav-link">Calendar</li>
        <li onClick={() => navigate("/employeeAbsentRequests")} className="nav-link">Absent Requests</li>
        <li onClick={() => navigate("/employeeRegistration")} className="nav-link">Emp Registration</li>
        <li onClick={() => navigate("/logout")} className="nav-link">Logout</li>
      </ul>
    </SlidingPane>
  );
};

export default SlidePanelComponent;
