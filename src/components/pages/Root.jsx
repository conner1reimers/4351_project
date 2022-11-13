import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';

const Root = () => {
  const [userInfo, setUserInfo] = useState({
    user: null
  });

  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const checkLoggedInUser = async () => {
    let result;
    try {
      result = await sendRequest('/users/checkForCookie');
      if (result) {
        setUserInfo(result);
        navigate('/tables');
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    }
  };

  // Check if user has an account saved in cookies
  useEffect(() => {
    checkLoggedInUser();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <h1 className="welcome-subheader">Loading....</h1>
        </div>
      ) : (
        <Outlet context={[userInfo, setUserInfo]} />
      )}
    </>
  );
};

export default Root;
