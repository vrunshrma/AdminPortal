import React, { useState, useEffect } from 'react';
import { loginAPICall } from '../authService/PublicAuthService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authService/AuthContext'; // Import useAuth

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserDetails } = useAuth(); // Get setUserDetails from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/employeeList');
    }
  }, [navigate]);

  const handleLoginForm = (e) => {
    e.preventDefault();
    setError("");

    const login = { username, password };
    loginAPICall(login)
      .then((response) => {
        if (!response.data) {
          throw new Error("No data received");
        }

        const { accessToken, authenticateUser } = response.data;
        console.log('Token:', accessToken);
        console.log('User details:', authenticateUser);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("role", authenticateUser.role);
        // Store user details in AuthContext
        setUserDetails(authenticateUser);

        window.dispatchEvent(new Event("authChange")); // Notify AuthProvider

        navigate("/employeeDashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError("Username or password is incorrect. Please try again.");
      });
  };

  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <div className='card'>
            <div className='card-header'>
              <h2 className='text-center'> Login Form </h2>
            </div>
            <div className='card-body'>
              {error && <div className='alert alert-danger'>{error}</div>}
              <form>
                <div className='row mb-3'>
                  <label className='col-md-3 control-label'> Username</label>
                  <div className='col-md-9'>
                    <input
                      type='text'
                      name='username'
                      className='form-control'
                      placeholder='Enter Username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <label className='col-md-3 control-label'> Password </label>
                  <div className='col-md-9'>
                    <input
                      type='password'
                      name='password'
                      className='form-control'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className='form-group mb-3'>
                  <button className='btn btn-primary' onClick={handleLoginForm}>Submit</button>
                  <Link to='/emailSubmit' className='btn btn-link'>Forgot Password?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
