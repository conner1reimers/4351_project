import { useState, useEffect } from 'react';
import axios from 'axios';

const ViewTables = (props) => {
  const [data, setData] = useState([]);

  const handleClick = async () => {
    setData(props.tables);
    console.log(props);
  };

  useEffect(() => {
    setData(props.tables);
    console.log(props.tables);
  }, [props.tables]);

  return (
    <div
      style={{
        flexDirection: 'column',
        backgroundColor: '#59737252',
        width: '70%',
        padding: '35px'
      }}>
      <button className=".btn" onClick={handleClick}>
        See Open Tables
      </button>

      {data
        ? data.map((tables) => {
            return (
              <div key={tables.maxSeats} style={{ flexDirection: 'row' }}>
                <h2>{tables.maxSeats} table seats:</h2>
                <div>
                  {tables.tableIds.map((el) => {
                    return <div key={el}>Table #{el}</div>;
                  })}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default ViewTables;
