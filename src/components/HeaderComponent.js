import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useAuth } from "../authService/AuthContext";
import { jwtDecode } from "jwt-decode";

const HeaderComponent = ({ togglePanel }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      // Ensure token is a valid string before decoding
      if (!token || typeof token !== "string") {
        setIsLoggedIn(false);
        return;
      }
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        console.log("decodedToken from header component : ", decodedToken);
        const tokenType = decodedToken.token_type; // Get token type
        // Set isLoggedIn only if token is valid and token_type is NOT "reset_password"
        setIsLoggedIn(!!token && tokenType !== "password_reset");
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false); // Invalidate login state if token is invalid
      }

      // Set isLoggedIn only if token exists and token_type is NOT "reset_password
    };

    checkToken();
    window.addEventListener("authChange", checkToken);
    return () => window.removeEventListener("authChange", checkToken);
  }, []);

  const handleRedirect = () => {
    navigate('/employeeList');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="navbar">
        {/* Hamburger Button */}
        {isAuthenticated && role !== "EMPLOYEE" && (
          <button className="hamburger-button" onClick={togglePanel}>
            &#9776;
          </button>
        )}

        {/* App Brand */}
        <span
          onClick={isAuthenticated ? handleRedirect : undefined}
          className="navbar-brand"
        >
          Attendance Management Application
        </span>

        {/* Navbar Menu */}
      </nav>
      <div className="navbar-collapse">
          <ul className="navbar-nav">
            {isAuthenticated && (
              <li className="nav-item">
                <span onClick={handleLogout} className="nav-link">
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
    </header>
  );
};

export default HeaderComponent;
