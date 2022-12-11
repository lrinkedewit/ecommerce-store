import pkg from 'sqlite3';
const { Database, OPEN_READWRITE, OPEN_CREATE} = pkg;

const db = new Database('./ecommerce.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
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

const newProductTable = `
CREATE TABLE IF NOT EXISTS Product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advisor_id INTEGER NOT NULL,
  name VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  price DECIMAL NOT NULL,
  FOREIGN KEY (advisor_id) REFERENCES Advisor (id)
)
`

db.exec(newAdvisorTable);
db.exec(newProductTable);


// Log to show that tables have been created for future insertion
db.all(
  'SELECT * FROM Advisor',
  (_, res) => console.log('All rows in Advisor table when server is started.', res)
);

db.all(
  'SELECT * FROM Product',
  (_, res) => console.log('All rows in Product table when server is started.', res)
);

export { db };