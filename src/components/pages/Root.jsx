import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';

const Root = () => {
  const [globalState, setGlobalState] = useState({
    user: null,
    tables: []
  });

  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  // Check if user has an account saved in cookies
  useEffect(() => {
    navigate('/login');
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <h1 className="welcome-subheader">Loading....</h1>
        </div>
      ) : (
        <Outlet context={[globalState, setGlobalState]} />
      )}
    </>
  );
};

export default Root;
