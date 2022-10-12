import express from 'express';
import bcrypt from 'bcrypt';
import { Addon } from '../models/addon';
import { User } from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await User.sync();
    await Addon.sync();
  } catch {
    // Ignore
  }

  // This is only for dev
  try {
    await User.create({ username: 'dev', passphrase: bcrypt.hashSync('dev', 10) });
  } catch {
    // Ignore
  }

  try {
    await Addon.create({ name: 'Addon 1', description: 'Description for Addon 1', version: '0.0.1', author: 'Dawosch', wiki: 'https://google.de' });
    await Addon.create({ name: 'Addon 2', description: 'Description for Addon 2', version: '0.0.2', author: 'Dawosch', wiki: 'https://google.de' });
    await Addon.create({ name: 'Addon 3', description: 'Description for Addon 3', version: '0.0.3', author: 'Dawosch', wiki: 'https://google.de' });
  } catch {
    // Ignore
  }

  res.sendStatus(200);
});

export default router;
