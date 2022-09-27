import express from 'express';
import UserModel from '../models/user';
import AddonModel from '../models/addon';

const router = express.Router();

router.get('/', async (req, res) => {
  await UserModel.sync();
  await AddonModel.sync();

  res.sendStatus(200);
});

export default router;
