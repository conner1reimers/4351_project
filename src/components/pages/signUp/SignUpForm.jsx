import React, { useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';

import Input from '../../shared/Input';
import { useHttpClient } from '../../../hooks/http-hook';
import { useOutletContext, useNavigate } from 'react-router-dom';

const SignUpForm = (props) => {
  console.log(`props: ${props}`);
  console.log(props.username);

  const { isLoading, sendRequest } = useHttpClient();
  const [globalState, setGlobalState] = useOutletContext();

  const navigate = useNavigate();

  // const formIsFilled = () => {
  //   if (
  //     props.formState.username != '' &&
  //     props.formState.email != '' &&
  //     props.formState.password != '' &&
  //     props.formState.name != '' &&
  //     props.formState.phone != '' &&
  //     props.formState.mailAddress != '' &&
  //     props.formState.payment != ''
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const signUp = async (e) => {
    e.preventDefault();
    // const formFilled = formIsFilled();
    // if (!formFilled) {
    //   alert('Please make sure all credentials are filled');
    //   return;
    // }

    setGlobalState((prevState) => ({
      ...prevState,
      userInfo: props.formState
    }));

    try {
      const response = await sendRequest(
        `/users/signup`,
        'POST',
        JSON.stringify({
          email: e.target[2].value,
          username: e.target[1].value,
          password: e.target[3].value,
          name: e.target[0].value,
          phone: e.target[5].value,
          payment: e.target[4].value,
          mailAddress: e.target[6].value,
          billAddress: e.target[7].value
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
        <MDBContainer fluid>
          <MDBRow className="justify-content-center align-items-center m-5">
            <MDBCard>
              <MDBCardBody className="px-4">
                <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Sign Up</h3>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput wrapperClass="mb-4" label="Name" size="lg" id="name" type="text" />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="User Name"
                      size="lg"
                      id="username"
                      type="text"
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput wrapperClass="mb-4" label="Email" size="lg" id="email" type="email" />
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Password"
                      size="lg"
                      id="password"
                      type="password"
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Payment Method"
                      size="lg"
                      id="payment"
                      type="text"
                    />
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Phone Number"
                      size="lg"
                      id="phone"
                      type="number"
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="12">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Mailing Address"
                      size="lg"
                      id="mailAddress"
                      type="text"
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="9">
                    <MDBInput
                      wrapperClass="mb-9"
                      label="Billing Address"
                      size="lg"
                      id="billAddress"
                      type="text"
                    />
                  </MDBCol>

                  <MDBCol md="3">
                    {/* <MDBInput wrapperClass="mb-3" size="lg" id="checkbox" type="checkbox" /> */}
                  </MDBCol>
                </MDBRow>
                <MDBBtn className="mb-4" size="lg">
                  Submit
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBRow>
        </MDBContainer>
      </form>
    </div>
  );
};

export default SignUpForm;
