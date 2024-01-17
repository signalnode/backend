import bcrypt from 'bcrypt';
import express from 'express';
import { Card } from '../models/card.model';
import { Property } from '../models/property.model';
import { User } from '../models/user.model';

const router = express.Router();

router.get('/', async (req, res) => {
  // This is only for dev
  try {
    await User.create({ username: 'dev', passphrase: bcrypt.hashSync('dev', 10) }).save();

    await Card.from({ type: 'test', config: undefined });

    console.log('DB successfully initialized');
  } catch (e) {
    console.error(e);
  }

  res.sendStatus(200);
});

router.get('/card', async (req, res) => {
  const props = await Property.find();
  await Card.from({ type: 'Chart' }).save();

  res.sendStatus(200);
});

export default router;
