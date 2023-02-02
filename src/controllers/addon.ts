import express from 'express';
import { Addon } from '../models/addon.model';
import { Property } from '../models/property.model';
// import AddonManager from '../helpers/addon_manager';
import { getAddon, getAddonDetails, installAddon, registerAddonTasks, registerPropertyTasks, stopTasks } from '../helpers/addon_helper';

const router = express.Router();

router.get('/', async (req, res) => {
  const addons = await Addon.find();

  // for (const addon of addons) {
  //   for (const name in AddonManager.getAll()) {
  //     if (addon.name === name) {
  //       continue;
  //     }

  //     // addon.error = 'Failed to load addon';
  //   }
  // }

  res.json(addons);
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const dbAddon = await Addon.findOneBy({ name });
  const npmAddon = await getAddon(name);
  console.log(npmAddon);

  if (!dbAddon || !npmAddon) return res.sendStatus(404);

  res.json({ ...dbAddon, configLayout: npmAddon.configLayout });
});

router.post('/:name/config', async (req, res) => {
  const { name } = req.params;
  const config = req.body;
  const addon = await Addon.findOneBy({ name });
  if (addon) {
    addon.config = config;
    addon.save();
  }

  res.sendStatus(200);
});

router.get('/:name/start', async (req, res) => {
  const { name } = req.params;
  const dbAddon = await Addon.findOne({ where: { name } });

  if (dbAddon) {
    const npmAddon = await getAddon(dbAddon.name);

    // if (!dbAddon || !npmAddon) return res.sendStatus(404);

    dbAddon.activated = true;
    await dbAddon.save();
    await npmAddon.start(dbAddon.config);
    registerAddonTasks(dbAddon.name, npmAddon.tasks ?? [], dbAddon.config, true);
    registerPropertyTasks(dbAddon.name, npmAddon.properties, dbAddon.config, true);
  }

  res.sendStatus(200);
});

router.get('/:name/stop', async (req, res) => {
  const { name } = req.params;
  const addon = await Addon.findOne({ where: { name } });

  if (!addon) return res.sendStatus(404);

  addon.activated = false;
  addon.save();
  // AddonManager.stopTasks(addon.name);
  stopTasks(addon.name);

  res.sendStatus(200);
});

router.get('/:name/install', async (req, res) => {
  const { name } = req.params;
  installAddon(name);
  const addon = await getAddon(name);
  const details = getAddonDetails(name);

  if (!addon || !details) return res.sendStatus(404);

  await Addon.from({
    ...details,
    activated: false,
    properties: addon.properties.map(({ name, description, value, unit, useHistory }) => Property.from({ name: name as string, description, value, unit, useHistory: useHistory })),
  }).save();

  res.sendStatus(200);
});

router.get('/:name/deinstall', async (req, res) => {
  const { name } = req.params;

  await (await Addon.findOneBy({ name }))?.remove();

  res.sendStatus(200);
});

export default router;
