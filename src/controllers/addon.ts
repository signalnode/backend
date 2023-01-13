import express from 'express';
import { Addon, updateEntityValues } from '../models/addon';
import ModuleManager from '../services/module_manager';

// type AddonDTO = typeof Addon & { error?: string };

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await Addon.findAll();

  for (const addon of addons) {
    for (const name in ModuleManager.getAllModules()) {
      if (addon.name === name) {
        continue;
      }

      // addon.error = 'Failed to load addon';
    }
  }

  res.json(addons);
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const addon = await Addon.findOne({ where: { name } });
  const module = ModuleManager.getModule(name);

  if (!addon || !module) return res.sendStatus(404);

  res.json({ ...addon.toJSON(), uiConfig: module.uiConfig });
});

router.post('/:name/config', async (req, res) => {
  const config = req.body;
  await Addon.update({ config }, { where: { name: req.params.name } });

  res.sendStatus(200);
});

router.get('/:name/start', async (req, res) => {
  const { name } = req.params;
  const addon = await Addon.findOne({ where: { name } });
  const module = ModuleManager.getModule(name);

  if (!addon || !module) {
    return res.sendStatus(404);
  }

  addon.activated = true;
  addon.save();
  module.run(addon.config);
  ModuleManager.registerJobs(addon, updateEntityValues);

  res.sendStatus(200);
});

router.get('/:name/stop', async (req, res) => {
  const { name } = req.params;
  const addon = await Addon.findOne({ where: { name } });
  const module = ModuleManager.getModule(name);

  if (!addon || !module) {
    return res.sendStatus(404);
  }

  addon.activated = false;
  addon.save();
  ModuleManager.stopJobs(addon.name);

  res.sendStatus(200);
});

router.get('/:name/install', async (req, res) => {
  const { name } = req.params;
  const module = await ModuleManager.install(name);

  if (!module) return res.sendStatus(404);

  const details = ModuleManager.getDetails(name);
  await Addon.create({ ...details, activated: false, entities: module.entities });

  res.sendStatus(200);
});

router.get('/:id/deinstall', async (req, res) => {
  await Addon.destroy({ where: { id: req.params.id } });

  res.sendStatus(200);
});

export default router;
