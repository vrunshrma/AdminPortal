import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { passwordResetEmail } from '../authService/PublicAuthService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/emailSubmitComponent.css';

const EmailSubmitComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        try {
            const response = await passwordResetEmail(email);
            if (response.status === 'SUCCESS') {
                setIsLoading(false);
                setMessage(response.message);
            } else if (response.status === 'FAILED') {
                setIsLoading(false);
                setError(response.message);
            } else {
                setIsLoading(false);
                throw new Error('Unexpected error occurred');
            }
        } catch (error) {
            if (error.response) {
                setIsLoading(false);
                setError(error.response.data.message || 'Network Error');
            } else {
                setIsLoading(false);
                setError('Network Error');
            }
        }
    };

    // Inside EmailSubmitComponent.jsx
const SmallInlineSpinner = () => (
  <div className="small-spinner-container">
    <div className="small-spinner"></div>
    <p className="small-spinner-text">Loading...</p>
  </div>
);


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
                                 {/* 👇 Custom spinner sirf isi page me */}
  {isLoading && (
    <div className="text-center my-2">
      <SmallInlineSpinner />
    </div>
  )}
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