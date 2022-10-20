import express from 'express';
import { Addon } from '../models/addon';
import ModuleManager from '../services/module_manager';

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await Addon.findAll();
  console.log('Modules:', ModuleManager.getAllModules());

  res.json(addons);
});

router.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const addon = await Addon.findOne({ where: { uuid } });

  res.json({ ...addon, settings: ModuleManager.getModule(req.params.uuid).getSettings() });
});

router.get('/install/:name', async (req, res) => {
  ModuleManager.install(req.params.name);
  res.sendStatus(200);
});

// router.post('/install', async (req, res) => {
//   const addon = req.body as AddonModel;
//   await Addon.create(addon);

//   res.sendStatus(200);
// });

router.get('/:id/deinstall', async (req, res) => {
  await Addon.destroy({ where: { id: req.params.id } });

  res.sendStatus(200);
});

router.get('/:uuid/settings', async (req, res) => {
  res.json(ModuleManager.getModule(req.params.uuid).getSettings());
});

router.post('/:name/config/save', async (req, res) => {
  const config = req.body;
  await Addon.update({ config }, { where: { name: req.params.name } });

  res.sendStatus(200);
});

export default router;
