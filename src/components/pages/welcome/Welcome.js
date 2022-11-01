import React, { useState } from 'react'
import '../../../App.css';
import Input from '../../shared/Input';
import { useNavigate } from "react-router-dom";

const Welcome = () => {

  const [formState, setFormState] = useState({
    username: "",
    password: ""
  })


  const navigate = useNavigate();


  const onInput = (id, value) => {
    setFormState((prev) => {
      return {
        ...prev,
        [id]: value
      }
    })
  }


  const goToTables = () => {
    navigate("/tables")
  }

  return (
    <div className='App'>
      <div className='welcome-header-container'>
        <h1 className='welcome-header'>Welcome to the restaurant!</h1>
      </div>
      <div className='sign-in-form-container'>

        <div className='sign-in-form'>
          <form>
            <Input
              type="text"
              id="username"
              onInput={onInput}
              placeholder="Username"

            />
            <Input
              type="password"
              id="password"
              onInput={onInput}
              placeholder="Password"
            />
          </form>
        </div>

        <div className='main-buttons-container'>
          <div className='sign-in-buttons-container'>
            <button className='continue-btn continue-btn-green' onClick={goToTables}>Sign in</button>
          </div>

          <div className='sign-in-buttons-container'>
            <button className='continue-btn' onClick={goToTables}>Continue as guest</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome