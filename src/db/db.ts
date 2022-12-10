import pkg from 'sqlite3';
const { Database, OPEN_READWRITE, OPEN_CREATE} = pkg;

let db = new Database('./advisor.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to database.')
});

const newAdvisorTable = `
CREATE TABLE IF NOT EXISTS Advisor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(100) NOT NULL,
  password CHAR(10) NOT NULL,
  name VARCHAR(200) NOT NULL
)`

db.exec((newAdvisorTable));

db.all(
  'SELECT * FROM newAdvisorTable',
  (_, res) => console.log(res)
);

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});