import express from 'express';
import bcrypt from 'bcrypt';
import { Addon } from '../models/addon';
import { User } from '../models/user';
import { Entity } from '../models/entity';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await User.sync();
  } catch (e) {
    // Ignore
    console.log(e);
  }

  try {
    await Addon.sync();
  } catch (e) {
    // Ignore
    console.log(e);
  }

  try {
    await Entity.sync();
  } catch (e) {
    // Ignore
    console.log(e);
  }

  // This is only for dev
  try {
    await User.create({ username: 'dev', passphrase: bcrypt.hashSync('dev', 10) });
  } catch {
    // Ignore
  }

  res.sendStatus(200);
});

export default router;
