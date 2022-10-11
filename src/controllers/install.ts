import express from 'express';
import bcrypt from 'bcrypt';
import AddonModel from '../models/addon';
import UserModel from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await UserModel.sync();
    await AddonModel.sync();
  } catch {
    // Ignore
  }

  // This is only for dev
  try {
    await UserModel.create({ username: 'dev', password: bcrypt.hashSync('dev', 10) });
  } catch {
    // Ignore
  }

  try {
    await AddonModel.create({ name: 'Addon 1', description: 'Description for Addon 1', version: '0.0.1', author: 'Dawosch', wiki: 'https://google.de', installed: false });
    await AddonModel.create({ name: 'Addon 2', description: 'Description for Addon 2', version: '0.0.2', author: 'Dawosch', wiki: 'https://google.de', installed: true });
    await AddonModel.create({ name: 'Addon 3', description: 'Description for Addon 3', version: '0.0.3', author: 'Dawosch', wiki: 'https://google.de', installed: false });
  } catch {
    // Ignore
  }

  res.sendStatus(200);
});

export default router;
