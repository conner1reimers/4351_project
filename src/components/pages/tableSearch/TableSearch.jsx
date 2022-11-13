import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Input from '../../shared/Input';
import DateTimePicker from 'react-datetime-picker';
import Datetime from 'react-datetime';
import getRandomTables from '../../../util/get-tables';
import '../../../App.css';
import 'react-datetime/css/react-datetime.css';

const tableMap = {
  2: 0,
  4: 1,
  6: 2,
  8: 3
};

const possibleCombinations = {
  2: [2],
  4: [[2, 2], [4]],
  6: [[2, 2, 2], [2, 4], [6]],
  8: [[2, 2, 2, 2], [2, 2, 4], [4, 4], [6, 2], [8]]
};

const TableSearch = () => {
  const [userInfo, setUserInfo] = useOutletContext();
  const [dateChosen, setDateChosen] = useState(new Date());
  const [tableState, setTableState] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

  const [formState, setFormState] = useState({
    numOfGuests: 0,
    name: userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || ''
  });

  useEffect(() => {
    setTableState(getRandomTables());
  }, []);

  useEffect(() => {
    console.log('RANDOM TABLES:');
    console.log(tableState);
  }, [tableState]);

  useEffect(() => {
    console.log('USER DATA:');
    console.log(userInfo);
  }, [userInfo]);

  // When the user types in the input form
  const onInput = (id, value) => {
    setFormState((prev) => {
      return {
        ...prev,
        [id]: value
      };
    });
  };

  useEffect(() => {
    if (formState.numOfGuests > 0 && formState.name && formState.email && formState.phone) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [formState]);

  const reserveTable = (numberOfGuests, tablesToReserve) => {
    console.log(`Party of ${numberOfGuests}...`);
    console.log(`Reserving ${tablesToReserve.length} tables...`);
    tablesToReserve.forEach((element) => {
      console.log('RESERVING ' + 1 + ' ' + element + ' SEATED TABLE');
      setTableState((prev) => {
        return {
          ...prev,
          [tableMap[element]]: {
            ...prev[tableMap[element]],
            reserved: prev[[tableMap[element]]].reserved + 1,
            open: prev[[tableMap[element]]].open - 1
          }
        };
      });
    });

    // Send request to server to reserve the table & add to database
    //
    //
    // .....
    //
    //
  };

  const checkIfCanReserve = (tables) => {
    let currentTwoTableOpen = tableState[0].open;
    let currentFourTableOpen = tableState[1].open;
    let currentSixTableOpen = tableState[2].open;
    let currentEightTableOpen = tableState[3].open;

    let canReserve = true;

    tables.forEach((element) => {
      if (element === 2) {
        if (currentTwoTableOpen - 1 < 0) {
          canReserve = false;
        }
        currentTwoTableOpen--;
      } else if (element === 4) {
        if (currentFourTableOpen - 1 < 0) {
          canReserve = false;
        }
        currentFourTableOpen--;
      } else if (element === 6) {
        if (currentSixTableOpen - 1 < 0) {
          canReserve = false;
        }
        currentSixTableOpen--;
      } else if (element === 8) {
        if (currentEightTableOpen - 1 < 0) {
          canReserve = false;
        }
        currentEightTableOpen = currentEightTableOpen - 1;
      }
    });

    return canReserve;
  };

  const combineTables = (numberOfGuests) => {
    let tableComboPossiblities;
    let comboIsPossible = false;

    if (numberOfGuests <= 4) {
      if (tableState[0].open < 2) {
        // User needs to wait
        alert('THERE ARE NO TABLES AVAILABLE RIGHT NOW');
      } else {
        reserveTable(numberOfGuests, [2, 2]);
      }
    } else if (numberOfGuests <= 6) {
      tableComboPossiblities = possibleCombinations[6];
    } else if (numberOfGuests <= 8) {
      tableComboPossiblities = possibleCombinations[8];
    }

    let tableCombo = [];

    tableComboPossiblities.forEach((element) => {
      const canReserve = checkIfCanReserve(element);
      if (canReserve) {
        tableCombo = element;
        comboIsPossible = true;
      }
    });

    if (comboIsPossible) reserveTable(numberOfGuests, tableCombo);
    else {
      alert('There is no possible table combination right now');
    }
  };

  const seeOpenTables = (e) => {
    e.preventDefault();
    const numberOfGuests = formState.numOfGuests;

    // tableState[0] holds 2 seated tables, tableState[1] holds 4 seated tables, and so on...
    if (numberOfGuests <= 2) {
      if (tableState[0].open === 0) {
        // User needs to wait until one is available
      } else {
        reserveTable(numberOfGuests, [2]);
      }
    } else if (numberOfGuests <= 4) {
      if (tableState[1].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [4]);
      }
    } else if (numberOfGuests <= 6) {
      if (tableState[2].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [6]);
      }
    } else if (numberOfGuests <= 8) {
      if (tableState[3].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [8]);
      }
    }
  };

  return (
    <div className="App" style={{ justifyContent: 'flex-start', marginTop: '15vh' }}>
      <div className="welcome-header-container">
        <h1 className="welcome-header">Reserve a table...</h1>
      </div>
      <form className="table-reservation-form" type="submit" onSubmit={seeOpenTables}>
        <div className="table-reservation-date-container">
          <h3>Please select a time and date for your reservation</h3>
          <DateTimePicker
            className="date-time-picker"
            onChange={setDateChosen}
            value={dateChosen}
          />
        </div>
        <div className="table-reservation-info-container">
          <h3>Please enter the following information for your reservation</h3>
          <div style={{ margin: '50px', marginTop: '20px' }}>
            <Input type="text" id="numOfGuests" onInput={onInput} placeholder="Number of guests" />
            <Input
              value={formState.name}
              type="text"
              id="name"
              onInput={onInput}
              placeholder="Name for reservation"
            />
            <Input
              value={formState.email}
              type="text"
              id="email"
              onInput={onInput}
              placeholder="Email address"
            />
            <Input
              value={formState.phone}
              type="text"
              id="phone"
              onInput={onInput}
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="table-reservation-button-container">
          {formIsValid ? (
            <button className="reset-btn see-tables-button">See Open Tables</button>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default TableSearch;
