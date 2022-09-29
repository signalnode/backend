import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HomenodeToken } from '../types/homenode-token';

const { JWT_SECRET } = process.env;

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.split(' ');

  if (!authorization || authorization[0] !== 'Bearer') return res.sendStatus(401);

  try {
    const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload & HomenodeToken;
    res.locals.userId = payload.id;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
