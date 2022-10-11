import express from 'express';
import AddonModel from '../models/addon';

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await AddonModel.findAll();

  res.json({ addons });
});

router.post('/', async (req, res) => {
  const filter = req.body as { installed?: boolean };

  const addons = await AddonModel.findAll({ where: filter });

  res.json({ addons });
});

router.get('/:id/install', async (req, res) => {
  await AddonModel.update({ installed: true }, { where: { id: req.params.id } });

  res.sendStatus(200);
});

router.get('/:id/deinstall', async (req, res) => {
  await AddonModel.update({ installed: false }, { where: { id: req.params.id } });

  res.sendStatus(200);
});

export default router;
