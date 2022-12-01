import React, { useEffect } from 'react';
import Input from '../../shared/Input';

const SignInForm = (props) => {
  // When the user types in the input form
  const onInput = (id, value) => {
    props.onInput(id, value);
  };

  return (
    <div className="inner-form-container">
      <form>
        <Input
          type="text"
          id="email"
          onInput={onInput}
          placeholder={props.isOnRegisterMode ? 'Email' : 'Email/Username'}
        />

        <Input type="password" id="password" onInput={onInput} placeholder="Password" />
      </form>
    </div>
  );
};

export default SignInForm;
