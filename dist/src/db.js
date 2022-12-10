import pkg from 'sqlite3';
const { Database } = pkg;
const db = new Database('db.sqlite');
db.get('SELECT RANDOM() % 100 as result', (_, res) => console.log(res));
