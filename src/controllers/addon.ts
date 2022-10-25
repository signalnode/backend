import express from 'express';
import { Addon, AddonModel } from '../models/addon';
import ModuleManager from '../services/module_manager';

type AddonDTO = AddonModel & { error?: string };

const router = express.Router();

router.get('/', async (req, res) => {
  const addons: AddonDTO[] = await Addon.findAll();

  for (const addon of addons) {
    console.log('ADDON:', addon);

    for (const name in ModuleManager.getAllModules()) {
      if (addon.name === name) {
        continue;
      }

      addon.error = 'Failed to load addon';
    }
  }

  res.json(addons);
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;

  const addon = await Addon.findOne({ where: { name } });
  const module = ModuleManager.getModule(name);

  if (!module) return res.sendStatus(404);

  res.json({ ...addon, uiConfig: module.getUIConfig() });
});

router.get('/install/:name', async (req, res) => {
  await ModuleManager.install(req.params.name);
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

router.get('/:name/settings', async (req, res) => {
  const module = ModuleManager.getModule(req.params.name);

  if (!module) return res.sendStatus(404);

  return res.json(module.getUIConfig());
});

router.post('/:name/config/save', async (req, res) => {
  const config = req.body;
  await Addon.update({ config }, { where: { name: req.params.name } });

  res.sendStatus(200);
});

export default router;
