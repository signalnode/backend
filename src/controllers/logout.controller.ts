import express from 'express';
import { User } from '../models/user.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await User.findOneBy({ id: res.locals.userId });
    if (user) user.token = undefined;

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(403);
  }
});

export default router;
