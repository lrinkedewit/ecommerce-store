"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const { Database } = sqlite3_1.default;
const db = new Database('db.sqlite');
const articlesTable = `
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL
)`;
const addArticlesToTable = `
INSERT OR REPLACE INTO articles VALUES
    (1, 'First article', 'Neque porro quisquam est qui'),
    (2, 'Second article', 'ipsum quia dolor sit amet'),
    (3, 'Last article', 'dolorem consectetur, adipisci velit')
`;
db.get('SELECT RANDOM() % 100 as result', (_, res) => console.log(res));
db.exec((articlesTable));
db.exec(addArticlesToTable);
db.all('SELECT title FROM articles ORDER BY LENGTH(description) DESC LIMIT 2', (_, res) => console.log(res));
