import express from 'express';
import { UniqueConstraintError } from 'sequelize';
import { User } from '../models/user';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  res.json(user);
});

router.post('/create', async (req, res) => {
  const { username, passphrase } = req.body as User;

  try {
    await User.create({ username, passphrase });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res.sendStatus(403);
    }
  }

  res.sendStatus(201);
});

export default router;
