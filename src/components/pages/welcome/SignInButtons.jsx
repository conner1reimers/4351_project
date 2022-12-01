import React from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useHttpClient } from '../../../hooks/http-hook';
import Loading from '../../shared/Loading';
import axios from 'axios';

const SignInButtons = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [globalState, setGlobalState] = useOutletContext();

  // Register the user a new account
  const signUp = async () => {
    setGlobalState((prevState) => ({
      ...prevState,
      userInfo: props.formState
    }));
    navigate('/signup');
  };

  // console.log(useUserInfoState);
  // Sign the user in
  const signIn = async () => {
    try {
      axios
        .post('http://127.0.0.1:5000/user/login', {
          em: props.formState.email,
          ps: props.formState.password
        })
        .then(function (response) {
          alert('Successfully logged in');

          setGlobalState((prevState) => ({
            ...prevState,
            userInfo: response.data.data[0]
          }));

          goToTables();
        })
        .catch(function (error) {
          alert(error.response.data.message);
        });
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
        <button className="reset-btn continue-btn continue-btn-green" onClick={signIn}>
          Sign in
        </button>
      </div>

      <div className="sign-in-buttons-container">
        <button className="reset-btn continue-btn" onClick={goToTables}>
          Continue as guest
        </button>
      </div>

      <div className="sign-in-buttons-container">
        <button onClick={signUp} className="reset-btn register-now-btn">
          Need an account? Register now!
        </button>
      </div>
    </div>
  );
};

export default SignInButtons;
