import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { createTokens } from '../helpers/token_helper';

// No middelware applied here, so there is no token nor a user id
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.cookies['refreshToken']);
  const { username, passphrase } = req.body;

  const user = await User.findOneBy({ username });

  if (!user || !bcrypt.compareSync(passphrase, user.passphrase)) {
    return res.sendStatus(401);
  }

  const { accessToken, refreshToken } = createTokens(user.id, user.username);
  user.token = refreshToken;
  await user.save();

  return res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true }).json({ accessToken, refreshToken });
});

export default router;
