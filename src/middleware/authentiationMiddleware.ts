import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.slice(7);

    try {
      const tokenData = verifyToken(token);
      res.locals.tokenData = tokenData;
      next();
    } catch (error) {
      res.status(401).setHeader('WWW-Authenticate', 'Bearer').send();
    }
  } else {
    res.status(401).setHeader('WWW-Authenticate', 'Bearer').send();
  }
};
