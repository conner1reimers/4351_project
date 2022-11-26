import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import '../../../App.css';

function SignUp() {
  const [isOnRegisterMode, setIsOnRegisterMode] = useState(true);

  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    phone: '',
    payment: '',
    mailAddress: '',
    billAddress: ''
  });

  // When the user types in the input form
  const onInput = (id, value) => {
    setFormState((prev) => {
      return {
        ...prev,
        [id]: value
      };
    });
  };

  const [userInfo, setUserInfo] = useOutletContext();

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      ...userInfo
    }));
  }, [userInfo]);

  return (
    <div className="App">
      <div className="welcome-header-container">
        <h1 className="welcome-header">Welcome to the restaurant!</h1>
        <h2 className="welcome-subheader">Sign up!</h2>
      </div>

      <div style={{ width: '70%' }}>
        <SignUpForm
          onInput={onInput}
          formState={formState}
          username={userInfo.username}
          email={userInfo.email}
          password={userInfo.password}
        />
      </div>
    </div>
  );
}

export default SignUp;
