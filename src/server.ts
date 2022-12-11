import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { db } from './db/db';
import { errorHandler } from 'src/error/error-handler'
import { ErrorException } from 'src/error/error-exception';
import { ErrorCode } from 'src/error/error-code';
import { comparePassword, passwordHash } from './utils/passwordUtils';
import { compare } from 'bcrypt';


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

app.post('/sign-up', (req: Request, res: Response) => {
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
      console.log('Error adding param', err);
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
        } else {
          //THROW ERROR password is incorrect
            // next(new ErrorException(ErrorCode.Unauthenticated));
          console.log('password is incorrect')
        }
      }
    }
  })
})


app.get('/test', (req: Request, res: Response) => {
  db.all('SELECT * FROM Advisor;', (err) => {
    if (err) {
      console.log('Error retaining rows from Advisor table', err)
    }
  })
  res.status(200).send('All entries are available in Advisor table.')
})

// app.get('/throw-unauthenticated', (req: Request, res: Response, next: NextFunction) => {
//   throw new ErrorException(ErrorCode.Unauthenticated);
//   // or
//   // next(new ErrorException(ErrorCode.Unauthenticated))
// });
// app.get('/throw-maximum-allowed-grade', (req: Request, res: Response, next: NextFunction) => {
//   throw new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() });
//   // or
//   // next(new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() }))
// });
// app.get('/throw-unknown-error', (req: Request, res: Response, next: NextFunction) => {
//   const num: any = null;
//   // Node.js will throw an error because there is no length property inside num variable
//   console.log(num.length);
// });

// app.use(errorHandler); // registration of handler


app.listen(3000, () => {
  console.log('Application started on port 3000!');
});

