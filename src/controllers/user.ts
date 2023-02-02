import express from 'express';
import { User } from '../models/user.model';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await User.findOneBy({ id: parseInt(req.params.id) });

  res.json(user);
});

router.post('/create', async (req, res) => {
  const { username, passphrase } = req.body as User;

  try {
    await User.create({ username, passphrase });
  } catch (err) {
    return res.sendStatus(403);
  }

  res.sendStatus(201);
});

export default router;
