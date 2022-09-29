import express from 'express';
import { UniqueConstraintError } from 'sequelize';
import UserModel from '../models/user';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await UserModel.findOne({ where: { id: req.params.id } });

  res.json(user);
});

router.post('/create', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };

  try {
    await UserModel.create({ username, password });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res.sendStatus(403);
    }
  }

  res.sendStatus(201);
});

export default router;
