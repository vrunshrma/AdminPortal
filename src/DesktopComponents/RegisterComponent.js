import React, { useState } from 'react'
import { registerAPICall } from '../authService/PrivateAuthService'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const RegisterComponent = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const role = 'Admin'
    const [address, setAddress] = useState('')
    const navigate = useNavigate();


    function handleRegistrationForm(e) {

        e.preventDefault();

        const register = { firstName, lastName, username, mobile, password, confirmPassword, role, address }

        registerAPICall(register).then((response) => {
            if (!response.data) {
                throw new Error('Registration not done');
            }
            navigate('/employeeDashboard');
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'> User Registration Form </h2>
                        </div>

                        <div className='card-body'>
                            <form>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> First Name </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='type'
                                            className='form-control'
                                            placeholder='Enter FirstName'
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Last Name </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='type'
                                            className='form-control'
                                            placeholder='Enter LastName'
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Username </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='type'
                                            className='form-control'
                                            placeholder='Enter Username'
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Mobile </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='type'
                                            className='form-control'
                                            placeholder='Enter Mobile'
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Password </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='type'
                                            className='form-control'
                                            placeholder='Enter Password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Confirm Password </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            placeholder='Enter ConfirmPassword'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Role </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='employeeId'
                                            className='form-control'
                                            placeholder='Enter Role'
                                            value={role}
                                            readOnly
                                            disabled
                                            // onChange={(e) => setRole(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> Address </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='employeeId'
                                            className='form-control'
                                            placeholder='Enter Address'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                                <div className='form-group mb-3'>
                                    <button className='btn btn-primary' onClick={(e) => handleRegistrationForm(e)}>Submit</button>

                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default RegisterComponent