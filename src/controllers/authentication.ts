import express from 'express';
import UserModel from '../models/user';
import { createAccessToken, createRefreshToken } from '../services/token_helper';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ where: { username, password } });

  if (!user) {
    res.sendStatus(401);
    return;
  }

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  await UserModel.update({ token: refreshToken }, { where: { username: user.getDataValue('username') } });

  res.json({ accessToken, refreshToken });
});

export default router;
