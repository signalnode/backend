import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import { createTokens } from '../services/token_helper';
import { RefreshToken } from '../types/signalnode-token';

const router = express.Router();
const { JWT_SECRET } = process.env;

router.get('/', async (req, res) => {
  const authorization = req.headers.authorization?.split(' ');

  if (!authorization || authorization[0] !== 'Bearer' || !authorization[1]) return res.sendStatus(400);

  try {
    const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload & RefreshToken;
    const user = await User.findByPk(payload.id);

    if (!user || authorization[1] !== user.token) return res.sendStatus(403);

    const { accessToken, refreshToken } = await createTokens(user.id, user.username);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);

    res.sendStatus(403);
  }
});

export default router;
