import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { passwordResetEmail } from '../authService/PublicAuthService';

const EmailSubmitComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/resetPassword');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await passwordResetEmail(email);
            if (response.status === 'SUCCESS') {
                setMessage(response.message);
            } else if (response.status === 'FAILED') {
                setError(response.message);
            } else {
                throw new Error('Unexpected error occurred');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Network Error');
            } else {
                setError('Network Error');
            }
        }
    };

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'>Find Your Account</h2>
                        </div>
                        <div className='card-body'>
                        {error && <div className='alert alert-danger'>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label>Email address</label>
                                    <input
                                        type='email'
                                        className='form-control'
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type='submit' className='btn btn-primary'>Submit</button>
                                <p className='mt-3'>
                                    {message && <span className={message.includes('successfully') ? 'text-success' : 'text-danger'}>{message}</span>}
                                </p>
                            </form>
                            <div className='mt-3'>
                                <Link to='/login'>Back to Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailSubmitComponent;