import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.split(' ');

  if (!authorization || authorization[0] !== 'Bearer') return res.sendStatus(401);

  try {
    jwt.verify(authorization[1], JWT_SECRET!);
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
