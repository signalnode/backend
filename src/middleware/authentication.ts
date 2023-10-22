import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SignalNodeToken } from '../types/signalnode-token';
import { User } from '../models/user.model';
import { createTokens } from '../helpers/token_helper';

const { JWT_SECRET } = process.env;

// export const validateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authorization = req.headers.authorization?.split(' ');

//   if (!authorization || authorization[0] !== 'Bearer') return res.sendStatus(401);

//   try {
//     const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload & AccessToken;
//     res.locals.userId = payload.id;
//     next();
//   } catch (err) {
//     return res.sendStatus(401);
//   }
// };

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.split(' ');
  if (!authorization || authorization[0] !== 'Bearer') return res.sendStatus(401);

  try {
    const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload & SignalNodeToken;
    res.locals.userId = payload.id;
    next();
  } catch (err) {
    if (!req.cookies['refreshToken']) return res.sendStatus(401);
    try {
      const payload = jwt.verify(req.cookies['refreshToken'], JWT_SECRET!) as JwtPayload & SignalNodeToken;
      const user = await User.findOne({ where: { id: payload.id } });
      if (!user) return res.sendStatus(404);
      if (user.token !== req.cookies['refreshToken']) return res.sendStatus(401);
      const { accessToken, refreshToken } = createTokens(user.id, user.username);
      user.token = refreshToken;
      user.save();
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true }).header('authorization', accessToken);
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  }
};
