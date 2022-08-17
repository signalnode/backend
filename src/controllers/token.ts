import express from 'express';
import UserModel from '../models/user';
import { createAccessToken, createRefreshToken, validateAccessToken } from '../services/token_helper';

const router = express.Router();
const { JWT_SECRET, JWT_EXPIRY } = process.env;

router.post('/create', async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ where: { username } });

  if (!user || user.getDataValue('password') !== password) {
    res.sendStatus(404);
    return;
  }

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  res.cookie('ACCESS_TOKEN', accessToken, { maxAge: parseInt(JWT_EXPIRY!) * 1000, httpOnly: true });
  res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true });

  res.end();
});

router.get('/refresh', (req, res) => {
  const { username, password } = req.body;

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  res.cookie('ACCESS_TOKEN', accessToken, { maxAge: parseInt(JWT_EXPIRY!) * 1000, httpOnly: true });
  res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true });

  res.end();
});

router.get('/validate', (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken || accessToken.indexOf(' ') === -1) {
    res.sendStatus(400);
    return;
  }

  const token = accessToken.split(' ')[1];
  const payload = validateAccessToken(token);

  res.json({ payload });
});

export default router;
