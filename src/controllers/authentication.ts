import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { createTokens } from '../services/token_helper';

// No middelware applied here, so there is no token nor a user id
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, passphrase } = req.body as User;

  console.log(username);
  console.log(passphrase);

  const user = await User.findOne({ where: { username } });

  if (!user || !bcrypt.compareSync(passphrase, user.passphrase)) {
    return res.sendStatus(401);
  }

  const { accessToken, refreshToken } = await createTokens(user.id, user.username);

  res.json({ accessToken, refreshToken });
});

export default router;
