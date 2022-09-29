import express from 'express';
import AddonModel from '../models/addon';

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await AddonModel.findAll();

  res.json({ addons });
});

export default router;
