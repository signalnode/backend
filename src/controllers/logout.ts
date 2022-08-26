import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/user';

const router = express.Router();
const { JWT_SECRET } = process.env;

router.get('/', async (req, res) => {
  const authorization = req.headers.authorization?.split(' ');

  if (!authorization || authorization[0] !== 'Bearer') return res.sendStatus(400);

  try {
    const payload = jwt.verify(authorization[1], JWT_SECRET!) as JwtPayload;
    await UserModel.update({ token: undefined }, { where: { username: payload.username } });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(403);
  }
});

export default router;
