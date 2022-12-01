import React, { useEffect, useState } from 'react';
import '../../../App.css';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignInButtons from './SignInButtons';
import axios from 'axios';

function Welcome() {
  const [isOnRegisterMode, setIsOnRegisterMode] = useState(true);

  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });

  const [globalState, setGlobalState] = useOutletContext();

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
    const getAllTables = async () => {
      const response = await axios.get('http://127.0.0.1:5000/tables/get/all', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data.data;
      const tables = { 2: [], 4: [], 6: [], 8: [] };

      let totalSeats = [0, 0, 0, 0];
      let openSeats = [0, 0, 0, 0];

      let tableIds = [[], [], [], []];

      for (let i = 0; i < data.length; i++) {
        const index = data[i].numSeats / 2 - 1;
        totalSeats[index]++;

        if (data[i].reserved === 0) {
          openSeats[index]++;
          tables[data[i].numSeats].push({
            ...data[i],
            maxSeats: data[i].numSeats
          });
          tableIds[index].push(data[i].tableNumber);
        }
      }

      console.log(tables);
      const finalTables = [];
      for (let i = 1; i <= 4; i++) {
        finalTables.push({
          maxSeats: i * 2,
          total: totalSeats[i - 1],
          open: openSeats[i - 1],
          reserved: totalSeats[i - 1] - openSeats[i - 1],
          tableIds: tableIds[i - 1]
        });
      }

      Object.entries(tables).forEach((el, i) => {
        console.log(el[1]);
      });

      setGlobalState((prevState) => ({
        ...prevState,
        finalTables
      }));
    };

    getAllTables();
  }, []);

  return (
    <div className="App">
      <div className="welcome-header-container">
        <h1 className="welcome-header">Welcome to the restaurant!</h1>
        <h2 className="welcome-subheader">Sign in!</h2>
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
