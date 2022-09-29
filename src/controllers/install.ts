import express from 'express';
import AddonModel from '../models/addon';
import UserModel from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  await UserModel.sync();
  await AddonModel.sync();

  res.sendStatus(200);
});

export default router;
