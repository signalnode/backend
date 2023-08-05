import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { createTokens } from '../helpers/token_helper';
import { RefreshToken } from '../types/signalnode-token';

const router = express.Router();
const { JWT_SECRET } = process.env;

router.get('/', async (req, res) => {
  const [bearer, token] = req.headers.authorization?.split(' ') ?? [];

  if (bearer !== 'Bearer' || !token) return res.sendStatus(400);

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as JwtPayload & RefreshToken;
    const user = await User.findOneBy({ id: payload.id });

    if (!user || token !== user.token) return res.sendStatus(403);

    const { accessToken, refreshToken } = createTokens(user.id, user.username);
    user.token = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);

    res.sendStatus(403);
  }
});

export default router;
