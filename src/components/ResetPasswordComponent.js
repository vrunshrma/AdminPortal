import React, { useState } from 'react';
import { resetPasswordAPI } from '../authService/PrivateAuthService';
import { useNavigate } from 'react-router-dom';

const ResetPasswordComponent = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('resetPasswordEmail');

    const handlePasswordResetForm = (e) => {
        e.preventDefault();
        if (!username) {
            console.error('Username is missing');
            return;
        }
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }
        
        const resetRequest = { username, password, confirmPassword };

        resetPasswordAPI(resetRequest)
            .then((response) => {
                if (!response.data) {
                    throw new Error('Password or Username not valid');
                }
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('resetPasswordEmail');
                window.dispatchEvent(new Event('authChange'));
                navigate('/login');
            })
            .catch(error => {
                console.error('Password reset failed:', error);
            });
    };

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'> RESET ACCOUNT PASSWORD </h2>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handlePasswordResetForm}>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> USERNAME </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='username'
                                            className='form-control'
                                            placeholder='Enter Username'
                                            value={username}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> PASSWORD </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'> CONFIRM PASSWORD </label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='confirmPassword'
                                            className='form-control'
                                            placeholder='Confirm password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group mb-3'>
                                    <button type='submit' className='btn btn-primary'>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordComponent;
