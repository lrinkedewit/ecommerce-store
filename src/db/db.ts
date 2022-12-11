import pkg from 'sqlite3';
const { Database, OPEN_READWRITE, OPEN_CREATE} = pkg;

const db = new Database('./advisor.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to database.')
});

const newAdvisorTable = `
CREATE TABLE IF NOT EXISTS Advisor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL
)`

db.exec(newAdvisorTable);

db.all(
  'SELECT * FROM Advisor',
  (_, res) => console.log('All rows in Advisor table when server is started.', res)
);

// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Closed the database connection.');
// });

export { db };