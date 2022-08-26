import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/user';
import { createAccessToken, createRefreshToken } from '../services/token_helper';

const router = express.Router();
const { JWT_SECRET } = process.env;

router.get('/', async (req, res) => {
  const authorization = req.headers.authorization?.split(' ');

  if (!authorization || authorization[0] !== 'Bearer' || !authorization[1]) return res.sendStatus(400);

  try {
    const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload;
    const user = await UserModel.findOne({ where: { username: payload.username } });

    if (!user || user.getDataValue('token') !== authorization[1]) return res.sendStatus(403);

    const accessToken = createAccessToken(user.getDataValue('username'));
    const refreshToken = createRefreshToken(user.getDataValue('username'));

    await user.update({ token: refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);

    res.sendStatus(403);
  }
});

export default router;
