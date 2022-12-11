import jwt from 'jsonwebtoken';
import { ErrorException } from '../error/error-exception';
import { ErrorCode } from '../error/error-code';
import { IUser } from 'src/types';

// Public key, this is a dummy key
const jwtKey = '12345';

export const generateAuthToken = (user: IUser): string => {
  const token = jwt.sign({ _id: user._id, email: user.email }, jwtKey, {
    expiresIn: '2h',
  });

  return token;
};

export const verifyToken = (token: string): { _id: string; email: string } => {
  try {
    const tokenData = jwt.verify(token, jwtKey);
    return tokenData as { _id: string; email: string };
  } catch (error) {
    throw new ErrorException(ErrorCode.Unauthenticated);
  }
};