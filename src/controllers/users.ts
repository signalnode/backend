import express from 'express';
import { UniqueConstraintError } from 'sequelize';
import User from '../models/user';
import UserModel from '../models/user';
import { createAccessToken, createRefreshToken } from '../services/token_helper';

const router = express.Router();
const { JWT_SECRET, JWT_EXPIRY } = process.env;

router.post('/create', async (req, res) => {
  const { username, password } = req.body;

  try {
    await UserModel.create({ username, password });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.sendStatus(403);
      return;
    }
  }

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  res.cookie('ACCESS_TOKEN', accessToken, { maxAge: parseInt(JWT_EXPIRY!) * 1000, httpOnly: true });
  res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true });

  res.end();
});

export default router;
