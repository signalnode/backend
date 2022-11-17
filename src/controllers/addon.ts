import express from 'express';
import { Addon } from '../models/addon';
import { Entity } from '../models/entity';
import ModuleManager from '../services/module_manager';

// type AddonDTO = typeof Addon & { error?: string };

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await Addon.findAll();

  for (const addon of addons) {
    console.log('ADDON:', addon);

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

  res.json({ ...addon.toJSON(), uiConfig: module.getUIConfig?.() });
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

  module.run(addon.config);

  res.sendStatus(200);
});

router.get('/install/:name', async (req, res) => {
  const { name } = req.params;
  const module = await ModuleManager.install(name);

  if (!module) return res.sendStatus(404);

  const details = ModuleManager.getDetails(name);
  const addon = await Addon.create({ ...details, disabled: true });

  if (module.getEntities) {
    await Entity.bulkCreate(module.getEntities().map((entity) => ({ name: entity.name, description: entity.description, value: entity.value, addonId: addon.id })));
  }

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

export default router;
