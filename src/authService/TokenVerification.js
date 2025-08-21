import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateToken } from '../authService/PublicAuthService'; // Adjust the import path as needed
import { Circles } from 'react-loader-spinner'; // Import the spinner component

const TokenVerificationComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Extract the token and id parameters from the query string
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    const idFromUrl = searchParams.get('id');

    // Validate the token
    validateToken(idFromUrl, tokenFromUrl)
      .then((response) => {
        if (!response.data) {
          setMessage(response.data.message);
          navigate('/emailSubmit');
        }
        console.log('Token validation successful:', response.data);
        console.log('Token validation successful user email :', response.data.authenticateUser.email);
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('role', response.data.authenticateUser.role);
        localStorage.setItem('resetPasswordEmail',response.data.authenticateUser.email);

        window.dispatchEvent(new Event("authChange"));
        navigate('/resetPassword');
      })
      .catch((error) => {
        console.error('Token validation failed:', error);
        navigate('/emailSubmit'); // Redirect to the submit email page if validation fails
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the validation is complete
      });
  }, [location.search, navigate]);

  return (
    <div className="spinner-container">
      {loading ? (
        <>
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p>Verifying Token...</p>
        </>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default TokenVerificationComponent;
