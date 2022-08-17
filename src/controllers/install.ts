import express from 'express';
import User from '../models/user';
import UserModel from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  await UserModel.sync();

  res.sendStatus(200);
});

export default router;
