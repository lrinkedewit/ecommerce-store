import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { db } from './db/db';
import { errorHandler } from './error/error-handler'
import { ErrorException } from './error/error-exception';
import { ErrorCode } from './error/error-code';
import { comparePassword, passwordHash } from './utils/passwordUtils';
import { compare } from 'bcrypt';
import { generateAuthToken } from './utils/jwtUtils';


const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json())


app.get('/', (req: Request, res: Response) => {
  res.send('Application works!');
});

app.post('/sign-up', (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  // hash password
  const hash = passwordHash(password);

  // insert sanitized values into Advisor table
  const stmt = db.prepare('INSERT INTO Advisor (email, name, password) VALUES (:email, :name, :password)', { ':email': email, ':name': name, ':password': hash }, (err) => {
    if (err) {
      console.log('Error preparing statement', err)
    }
    else {
      console.log('Successfully prepared statement with params.');
    }
  })

  stmt.get((err) => {
    if (err) {
      next(new ErrorException(ErrorCode.AlreadyExists));
    }
    else res.status(200).send('Successfully added new user.');
  })

  stmt.finalize();
  
})

app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  // destructure req.body
  const { email, password } = req.body;

  // check if email exists
  const stmt = db.prepare('SELECT * FROM Advisor WHERE (email) = (:email)', { ':email': email }, (err) => {
    if (err) {
      console.log('Error preparing statement', err)
    }
    else {
      console.log('Successfully prepared statement with params.');
      console.log(email)
    }
  })

  stmt.get((err, row) => {
    if (err) {
      console.log('Error querying database in login flow', err);
    }
    else {
      if (row === undefined) {
        console.log('Email does not exist')
      }
      else {
        console.log('Email exists', row)
        const passwordCorrect = comparePassword(password, row.password)
        if (passwordCorrect === true) {
          // respond with JWT
          console.log('issuing JWT')
          const token = generateAuthToken(row)
          res.status(200).send(token);
        } else {
          // THROW ERROR password is incorrect
            next(new ErrorException(ErrorCode.Unauthenticated));
          console.log('password is incorrect')
        }
      }
    }
  })
})

app.post('/product', (req: Request, res: Response, next: NextFunction) => {
  // authentication JWT token

  // if all is verified, insert new product into table
})

app.get('/product', (req: Request, res: Response, next: NextFunction) => {
  // authentication with JWT token

  // return all items linked to the advisor's id
})


app.get('/test', (req: Request, res: Response) => {
  db.all('SELECT * FROM Advisor;', (err, rows) => {
    if (err) {
      console.log('Error retaining rows from Advisor table', err)
    } else {
      console.log(`Here are the rows in the Advisor table`, rows)
    }
  });
  db.all('SELECT * FROM Product;', (err, rows) => {
    if (err) {
      console.log('Error retaining rows from Product table', err)
    } else {
      console.log('Here are the rows in the Product table', rows)
    }
  });
  res.status(200).send('All entries are available in Advisor and Product table.');
});


app.listen(3000, () => {
  console.log('Application started on port 3000!');
});

