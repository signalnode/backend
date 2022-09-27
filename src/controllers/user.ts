import express from 'express';
import { UniqueConstraintError } from 'sequelize';
import UserModel from '../models/user';
import { createTokens } from '../services/token_helper';

const router = express.Router();
const { JWT_EXPIRY } = process.env;

router.get('/:id', async (req, res) => {
  const user = await UserModel.findOne({ where: { id: req.params.id } });

  res.json(user);
});

// TODO: Refactor this controller
router.post('/create', async (req, res) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken } = await createTokens(username);

  try {
    await UserModel.create({ username, password, token: refreshToken });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.sendStatus(403);
      return;
    }
  }

  res.end();
});

export default router;
