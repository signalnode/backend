import express from 'express';
import { User } from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await User.update({ token: undefined }, { where: { id: res.locals.useId } });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(403);
  }
});

export default router;
