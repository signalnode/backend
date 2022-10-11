import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';
import { createTokens } from '../services/token_helper';

// No middelware applied here, so there is no token nor a user id
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ where: { username } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.sendStatus(401);
  }

  const { accessToken, refreshToken } = await createTokens(user.id, user.username);

  res.json({ accessToken, refreshToken });
});

export default router;
