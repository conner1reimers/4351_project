import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Input from '../../shared/Input';
import DateTimePicker from 'react-datetime-picker';
import Datetime from 'react-datetime';
import getRandomTables from '../../../util/get-tables';
import '../../../App.css';
import 'react-datetime/css/react-datetime.css';
import ViewTables from './viewTables';
import axios from 'axios';
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

function checkHoliday(dt_date) {
  // check simple dates (month/date - no leading zeroes)
  var n_date = dt_date.getDate(),
    n_month = dt_date.getMonth() + 1;
  var s_date1 = n_month + '/' + n_date;

  if (
    s_date1 == '1/1' || // New Year's Day
    s_date1 == '6/14' || // Flag Day
    s_date1 == '7/4' || // Independence Day
    s_date1 == '11/11' || // Veterans Day
    s_date1 == '12/25' // Christmas Day
  )
    return true;

  // weekday from beginning of the month (month/num/day)
  var n_wday = dt_date.getDay(),
    n_wnum = Math.floor((n_date - 1) / 7) + 1;
  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

  if (
    s_date2 == '1/3/1' || // Birthday of Martin Luther King, third Monday in January
    s_date2 == '2/3/1' || // Washington's Birthday, third Monday in February
    s_date2 == '5/3/6' || // Armed Forces Day, third Saturday in May
    s_date2 == '9/1/1' || // Labor Day, first Monday in September
    s_date2 == '10/2/1' || // Columbus Day, second Monday in October
    s_date2 == '11/4/4' // Thanksgiving Day, fourth Thursday in November
  )
    return true;

  // weekday number from end of the month (month/num/day)
  var dt_temp = new Date(dt_date);
  dt_temp.setDate(1);
  dt_temp.setMonth(dt_temp.getMonth() + 1);
  dt_temp.setDate(dt_temp.getDate() - 1);
  n_wnum = Math.floor((dt_temp.getDate() - n_date - 1) / 7) + 1;
  var s_date3 = n_month + '/' + n_wnum + '/' + n_wday;

  if (
    s_date3 == '5/1/1' // Memorial Day, last Monday in May
  )
    return true;

  // misc complex dates
  if (
    s_date1 == '1/20' &&
    (dt_date.getFullYear() - 1937) % 4 == 0
    // Inauguration Day, January 20th every four years, starting in 1937.
  )
    return true;

  if (
    n_month == 11 &&
    n_date >= 2 &&
    n_date < 9 &&
    n_wday == 2
    // Election Day, Tuesday on or after November 2.
  )
    return true;

  return false;
}

const TableSearch = () => {
  const [globalState, setGlobalState] = useOutletContext();
  const [dateChosen, setDateChosen] = useState(new Date());
  const [formIsValid, setFormIsValid] = useState(false);

  const [formState, setFormState] = useState({
    numOfGuests: 0,
    name: globalState.userInfo?.name || '',
    email: globalState.userInfo?.email || '',
    phone: globalState.userInfo?.phone || ''
  });

  // useEffect(() => {
  //   setTableState(getRandomTables());
  //   console.log(globalState);
  // }, []);

  // useEffect(() => {
  //   console.log('RANDOM TABLES:');
  //   console.log(tableState);
  // }, [tableState]);

  useEffect(() => {
    console.log('USER DATA:');
    console.log(globalState.userInfo);
  }, [globalState.userInfo]);

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

  const reserveTable = async (numberOfGuests, tablesToReserve) => {
    console.log(`Party of ${numberOfGuests}...`);
    console.log(`Reserving ${tablesToReserve.length} tables...`);

    const allReservedTableNumbers = [];

    tablesToReserve.forEach((element) => {
      console.log('RESERVING ' + 1 + ' ' + element + ' SEATED TABLE');
      console.log(`el: ${element}`);
      const tableArray = globalState.finalTables;
      const tableIds = tableArray[tableMap[element]].tableIds;
      const reservedTable = tableIds.shift();

      allReservedTableNumbers.push(reservedTable);

      tableArray[tableMap[element]] = {
        ...globalState.finalTables[tableMap[element]],
        reserved: globalState.finalTables[[tableMap[element]]].reserved + 1,
        open: globalState.finalTables[[tableMap[element]]].open - 1,
        tableIds: tableIds
      };

      setGlobalState((prev) => {
        return {
          ...prev,
          finalTables: tableArray
        };
      });
    });
    let reservedMsg = 'You just reserved table #';

    let index = 1;
    for (const value of allReservedTableNumbers) {
      await axios.post(
        `http://127.0.0.1:5000/user/reserve?id=${value}&nm=${formState.name}&dt=${new Date(
          new Date(dateChosen).getTime() - new Date().getTimezoneOffset() * 60 * 1000
        )
          .toJSON()
          .slice(0, 19)
          .replace('T', ' ')}`,
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json'
          },
          withCredentials: true
        }
      );

      reservedMsg = reservedMsg + value;
      if (allReservedTableNumbers.length > index) {
        reservedMsg = reservedMsg + ' and ';
      }
      index++;
    }
    console.log(reservedMsg);
    alert(reservedMsg);
  };

  const checkIfCanReserve = (tables) => {
    let currentTwoTableOpen = globalState.finalTables[0].open;
    let currentFourTableOpen = globalState.finalTables[1].open;
    let currentSixTableOpen = globalState.finalTables[2].open;
    let currentEightTableOpen = globalState.finalTables[3].open;

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
      if (globalState.finalTables[0].open < 2) {
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

    // globalState.finalTables[0] holds 2 seated tables, globalState.finalTables[1] holds 4 seated tables, and so on...
    if (numberOfGuests <= 2) {
      if (globalState.finalTables[0].open === 0) {
        // User needs to wait until one is available
      } else {
        reserveTable(numberOfGuests, [2]);
      }
    } else if (numberOfGuests <= 4) {
      if (globalState.finalTables[1].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [4]);
      }
    } else if (numberOfGuests <= 6) {
      if (globalState.finalTables[2].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [6]);
      }
    } else if (numberOfGuests <= 8) {
      if (globalState.finalTables[3].open === 0) {
        combineTables(numberOfGuests);
      } else {
        reserveTable(numberOfGuests, [8]);
      }
    }
  };

  const changeDate = (e) => {
    const isHoliday = checkHoliday(e);

    if (isHoliday) {
      alert('This is a busy day, if you do not show up you will be charged a minimum of $10.');
    }

    setDateChosen(e);
  };

  return (
    <div className="App" style={{ justifyContent: 'flex-start', marginTop: '15vh' }}>
      <div className="welcome-header-container">
        <h1 className="welcome-header">Reserve a table...</h1>
      </div>
      <ViewTables tables={globalState.finalTables} />
      <form className="table-reservation-form" type="submit" onSubmit={seeOpenTables}>
        <div className="table-reservation-date-container">
          <h3>Please select a time and date for your reservation</h3>
          <DateTimePicker className="date-time-picker" onChange={changeDate} value={dateChosen} />
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
            <button className="reset-btn see-tables-button">Reserve a table</button>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default TableSearch;
