import React, { useEffect, useState } from 'react';
import '../../../App.css';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignInButtons from './SignInButtons';

function Welcome() {
  const [isOnRegisterMode, setIsOnRegisterMode] = useState(true);

  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });

  const [userInfo, setUserInfo] = useOutletContext();

  // When the user types in the input form
  const onInput = (id, value) => {
    setFormState((prev) => {
      return {
        ...prev,
        [id]: value
      };
    });
  };

  // Change to sign in / sign up mode
  const changeFormMode = () => {
    setIsOnRegisterMode((prev) => !prev);
  };

  useEffect(() => {
    setUserInfo({
      username: 'test',
      email: 'test123@test.com',
      password: 'test123',
      name: 'testname',
      phone: '398-341-3211'
    });
  }, []);

  return (
    <div className="App">
      <div className="welcome-header-container">
        <h1 className="welcome-header">Welcome to the restaurant!</h1>
        <h2 className="welcome-subheader">{isOnRegisterMode ? 'Sign up!' : 'Sign in!'}</h2>
      </div>
      <div>
        <SignInForm onInput={onInput} isOnRegisterMode={isOnRegisterMode} />
        <SignInButtons
          isOnRegisterMode={isOnRegisterMode}
          changeFormMode={changeFormMode}
          formState={formState}
        />
      </div>
    </div>
  );
}

export default Welcome;
