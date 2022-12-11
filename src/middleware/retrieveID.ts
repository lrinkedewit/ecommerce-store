import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../error/error-code';
import { ErrorException } from '../error/error-exception';
import { db } from '../db/db';

export const retrieveID = (req: Request, res: Response, next: NextFunction) => {
  // Find user's id based on their email
  const email: string = res.locals.tokenData.email;
  const idStmt = db.prepare('SELECT id FROM Advisor WHERE email = (:email)', {':email': email});

  idStmt.get((err, row) => {
    if (err) {
      next(new ErrorException(ErrorCode.UnknownError));
    }
    else {
      res.locals.id = row.id;
      next();
    }
  })

  idStmt.finalize();
}
