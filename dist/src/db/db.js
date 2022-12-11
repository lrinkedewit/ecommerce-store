"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const { Database, OPEN_READWRITE, OPEN_CREATE } = sqlite3_1.default;
const db = new Database('./advisor.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to database.');
});
exports.db = db;
const newAdvisorTable = `
CREATE TABLE IF NOT EXISTS Advisor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  name VARCHAR(200) NOT NULL
)`;
const newProductTable = `
CREATE TABLE IF NOT EXISTS Product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advisor_id INTEGER NOT NULL,
  name VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  price DECIMAL NOT NULL,
  FOREIGN KEY (advisor_id) REFERENCES Advisor (id)
)
`;
db.exec(newAdvisorTable);
db.exec(newProductTable);
db.all('SELECT * FROM Advisor', (_, res) => console.log('All rows in Advisor table when server is started.', res));
db.all('SELECT * FROM Product', (_, res) => console.log('All rows in Advisor table when server is started.', res));
