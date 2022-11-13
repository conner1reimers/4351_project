// Get a random number to use in function below
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// GET RANDOM AMOUNT OF TEST TABLES
export default function getRandomTables() {
  const tables = [];

  // Fill in the array with total & reserved number of tables
  // For tables with maxiumum seats of 2, 4, 6, and 8
  for (let i = 1; i <= 4; i++) {
    const totalNumTables = getRandomInt(5, 15);
    let numReserved = getRandomInt(0, totalNumTables);
    if (i === 4 || i === 1) numReserved = totalNumTables;
    tables.push({
      maxSeats: i * 2,
      total: totalNumTables,
      reserved: numReserved,
      open: totalNumTables - numReserved
    });
  }

  // Return the filled in tables array
  return tables;
}
