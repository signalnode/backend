import express from 'express';
import AddonModel from '../models/addon';
import { createTokens } from '../services/token_helper';

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await AddonModel.findAll();

  const { accessToken, refreshToken } = await createTokens(res.locals.username);

  res.json({ accessToken, refreshToken, addons });
});

export default router;
