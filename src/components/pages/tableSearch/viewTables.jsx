import { useState } from 'react';
import axios from 'axios';

const ViewTables = () => {
  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://127.0.0.1:5000/tables/get/all', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('data is: ', JSON.stringify(data, null, 4));

      setData(data);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data);

  return (
    <div>
      {err && <h2>{err}</h2>}

      <button onClick={handleClick}>See Open Tables</button>

      {isLoading && <h2>Loading...</h2>}

      {data.data.map((tables) => {
        return (
          <div key={tables.tableNumber}>
            <h2>{tables.tableNumber}</h2>
            <h2>{tables.numSeats}</h2>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default ViewTables;
