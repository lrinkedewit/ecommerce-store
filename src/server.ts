import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { db } from './db/db';
import { ErrorException } from './error/error-exception';
import { ErrorCode } from './error/error-code';
import { comparePassword, passwordHash } from './utils/passwordUtils';
import { generateAuthToken } from './utils/jwtUtils';
import { authenticationMiddleware } from './middleware/authentiationMiddleware';
import { retrieveID } from './middleware/retrieveID';

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

  // Bind values to parameters in SQL query
  const stmt = db.prepare('INSERT INTO Advisor (email, name, password) VALUES (:email, :name, :password)', { ':email': email, ':name': name, ':password': hash }, (err) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
  })

  // Execute SQL query
  stmt.get((err) => {
    if (err) {
      // 19 = SQL constraint (UNIQUE)
      if ((err as any).errno  === 19) {
        next(new ErrorException(ErrorCode.AlreadyExists));  
      }
      else next(new ErrorException(ErrorCode.UnknownError));
    }
    else res.status(200).send('Successfully added new user.');
  }).finalize();
  
})

app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const stmt = db.prepare('SELECT * FROM Advisor WHERE (email) = (:email)', { ':email': email }, (err) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
  })
 
  stmt.get((err, row) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
    else {
      // When no rows are returned, it means the email doesn't exist in the Advisor table
      if (row === undefined) {
        next(new ErrorException(ErrorCode.Unauthenticated))
      }
      else {
        if (comparePassword(password, row.password)) {
          // If passwords match, issue JWT
          const token = generateAuthToken(row)
          res.status(200).send(token);
        } else {
          // THROW ERROR password is incorrect
          next(new ErrorException(ErrorCode.Unauthenticated));
        }
      }
    }
  }).finalize();
})

app.post('/product', authenticationMiddleware, retrieveID, (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price } = req.body;
  const id = res.locals.id

  const stmt = db.prepare('INSERT INTO Product (advisor_id, name, description, price) VALUES (:advisor_id, :name, :description, :price)', { ':advisor_id': id, ':name': name, ':description': description, ':price': price }, (err) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
  })

  stmt.get((err) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
    else res.status(200).send('Successfully added new product.');
  }).finalize();
})

app.get('/product', authenticationMiddleware, retrieveID, (req: Request, res: Response, next: NextFunction) => {
  const id = res.locals.id

  const stmt = db.prepare('SELECT * FROM Product WHERE advisor_id = (:advisor_id)', {':advisor_id': id}, (err) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
  })

  stmt.all((err, rows) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
    else {
      res.status(200).send(rows);
    }
  })
})

// Admin only, for testing purposes in Postman
app.get('/readalltables', (req: Request, res: Response) => {
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

export { app };