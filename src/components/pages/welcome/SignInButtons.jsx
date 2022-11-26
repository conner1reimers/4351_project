import React from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useHttpClient } from '../../../hooks/http-hook';
import Loading from '../../shared/Loading';

const SignInButtons = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useOutletContext();

  // Register the user a new account
  const signUp = async () => {
    console.log(props.formState);
    setUserInfo(props.formState);
    navigate('/signup');
  };

  // console.log(useUserInfoState);
  // Sign the user in
  const signIn = async () => {
    try {
      const response = await sendRequest(
        `/users/signin/`,
        'POST',
        JSON.stringify({
          username: props.formState.username,
          password: props.formState.password
        }),
        { 'Content-Type': 'application/json' }
      );
      if (response.success) {
        goToTables();
      }
    } catch (error) {
      alert('An error occurred, could not sign in. Please check your credentials.');
    }
  };

  // Go to the tables page
  const goToTables = () => {
    navigate('/tables');
  };

  return (
    <div className="main-buttons-container">
      {isLoading ? <Loading /> : null}

      <div className="sign-in-buttons-container">
        <button
          className="reset-btn continue-btn continue-btn-green"
          onClick={props.isOnRegisterMode ? signUp : signIn}>
          {props.isOnRegisterMode ? 'Sign up!' : 'Sign in'}
        </button>
      </div>

      <div className="sign-in-buttons-container">
        <button className="reset-btn continue-btn" onClick={goToTables}>
          Continue as guest
        </button>
      </div>

      <div className="sign-in-buttons-container">
        <button onClick={props.changeFormMode} className="reset-btn register-now-btn">
          {props.isOnRegisterMode
            ? 'Already have an account? Sign in!'
            : 'Need an account? Register now!'}
        </button>
      </div>
    </div>
  );
};

export default SignInButtons;
