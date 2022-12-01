import React, { useEffect } from 'react';
import Input from '../../shared/Input';
import { useHttpClient } from '../../../hooks/http-hook';
import { useOutletContext, useNavigate } from 'react-router-dom';

const SignUpForm = (props) => {
  console.log(`props: ${props}`);
  console.log(props.username);

  const { isLoading, sendRequest } = useHttpClient();
  const [globalState, setGlobalState] = useOutletContext();

  const navigate = useNavigate();

  const formIsFilled = () => {
    if (
      props.formState.username != '' &&
      props.formState.email != '' &&
      props.formState.password != '' &&
      props.formState.name != '' &&
      props.formState.phone != '' &&
      props.formState.mailAddress != '' &&
      props.formState.payment != ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    const formFilled = formIsFilled();
    if (!formFilled) {
      alert('Please make sure all credentials are filled');
      return;
    }

    setGlobalState((prevState) => ({
      ...prevState,
      userInfo: props.formState
    }));

    try {
      const response = await sendRequest(
        `/users/signup/`,
        'POST',
        JSON.stringify({
          email: props.formState.email,
          username: props.formState.username,
          password: props.formState.password,
          name: props.formState.password,
          phone: props.formState.phone,
          payment: props.formState.payment,
          mailAddress: props.formState.mailAddress,
          billAddress: props.formState.billAddress
        }),
        { 'Content-Type': 'application/json' }
      );
      if (response.success) {
        navigate('/tables');
      }
    } catch (error) {
      alert('An error occurred, could not sign up');
    }

    navigate('/tables');
  };

  const changeBillingAddress = () => {};

  return (
    <div className="inner-form-container">
      <form onSubmit={signUp}>
        <Input
          value={props.email}
          type="text"
          id="email"
          onInput={props.onInput}
          placeholder="Email"
        />
        <Input
          value={props.username}
          type="text"
          id="username"
          onInput={props.onInput}
          placeholder="Username"
        />
        <Input
          value={props.password}
          type="password"
          id="password"
          onInput={props.onInput}
          placeholder="Password"
        />
        <Input type="text" id="name" onInput={props.onInput} placeholder="Name" />
        <Input type="text" id="phone" onInput={props.onInput} placeholder="Phone number" />
        <Input type="text" id="payment" onInput={props.onInput} placeholder="Payment Method" />
        <Input type="text" id="mailAddress" onInput={props.onInput} placeholder="Mailing Address" />
        <div style={{ width: '70%', display: 'flex' }}>
          <Input
            type="text"
            id="billAddress"
            onInput={props.onInput}
            placeholder="Billing Address"
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <input type="checkbox" name="billing" onChange={changeBillingAddress} />
            <label htmlFor="billing" style={{ color: 'white' }}>
              Same as mailing?
            </label>
          </div>
        </div>

        <div className="main-buttons-container">
          {isLoading ? <isLoading /> : null}

          <div className="sign-in-buttons-container">
            <button className="reset-btn continue-btn continue-btn-green" onClick={signUp}>
              Sign up!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
