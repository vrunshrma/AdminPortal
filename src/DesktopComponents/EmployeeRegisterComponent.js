import React, { useState } from 'react';
import { registerAPICall } from '../authService/PrivateAuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeeRegisterComponent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const role = 'Employee';
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [apiError, setApiError] = useState([]);

    const navigate = useNavigate();

    // Email validation function
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError('* Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    // Mobile number validation function
    const validateMobile = (number) => {
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(number)) {
            setMobileError('* Please enter a valid 10-digit mobile number.');
        } else {
            setMobileError('');
        }
    };

    function handleRegistrationForm(e) {
        e.preventDefault();

        if (emailError || mobileError || !username || !mobile) {
            alert('Please fix validation errors before submitting.');
            return;
        }

        setApiError([]);

        const register = {
            firstName,
            lastName,
            username,
            mobile,
            password,
            confirmPassword,
            role,
            address,
            department
        };

        registerAPICall(register)
            .then((response) => {
                if (!response.data) {
                    throw new Error('Registration not done');
                }
                navigate('/employeeDashboard');
            })
            .catch(error => {
                const errorList = error.response?.data?.errors; // Extract the list of errors
                console.log('errorList : ', errorList)
                if (Array.isArray(errorList)) {
                    setApiError(errorList); // Store all errors in state
                } else {
                    setApiError(['An error occurred during registration.']); // Default fallback
                }
            });
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'> Employee Registration Form </h2>
                        </div>

                        <div className='card-body'>
                            <form>
                                {/* First Name */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>First Name</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter First Name'
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Last Name</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter Last Name'
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Email (Username) */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Username</label>
                                    <div className='col-md-9'>
                                        {emailError && <small className="text-danger">{emailError}</small>}
                                        <input
                                            type='email'
                                            className='form-control'
                                            placeholder='Enter Email'
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                validateEmail(e.target.value);
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Mobile</label>
                                    <div className='col-md-9'>
                                        {mobileError && <small className="text-danger">{mobileError}</small>}
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter Mobile Number'
                                            value={mobile}
                                            onChange={(e) => {
                                                setMobile(e.target.value);
                                                validateMobile(e.target.value);
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>DOB</label>
                                    <div className='col-md-9'>
                                        <DatePicker
                                            selected={dateOfBirth}
                                            onChange={(date) => setDateOfBirth(date)}
                                            dateFormat='yyyy-MM-dd'
                                            className='form-control'
                                            placeholderText='Select Date of Birth'
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode='select'
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Password</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            className='form-control'
                                            placeholder='Enter Password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Confirm Password</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            className='form-control'
                                            placeholder='Confirm Password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Address</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter Address'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Department */}
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Department</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter Department'
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className='form-group mb-3'>
                                    <button className='btn btn-primary' onClick={(e) => handleRegistrationForm(e)}>Submit</button>
                                </div>
                            </form>
                        </div>
                        {apiError.length > 0 && (
                            <div className="alert alert-danger mt-3">
                                <ul>
                                    {apiError.map((err, index) => (
                                        <li key={index}>
                                            <strong>{err.field}</strong>: {err.errorMessage}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegisterComponent;
