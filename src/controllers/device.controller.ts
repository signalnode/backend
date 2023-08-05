import express from 'express';
import { Device } from '../models/device.model';
// import AddonManager from '../helpers/addon_manager';
import { eventBus } from '../core/event-bus';
import { serviceManager } from '../core/service-manager';
import { getIntegration } from '../helpers/integration-helper';
import { convertQueryToOptions } from '../helpers/query-helper';
import { getTasks } from '../helpers/task_manager';

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await Device.find(convertQueryToOptions(req.query));
  res.json(devices);
});

// Create new device
router.post('/', async (req, res) => {
  const { name, description, integration } = req.body;
  await Device.from({ name, description, activated: false, integration }).save();
  res.sendStatus(200);
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const device = await Device.findOne(convertQueryToOptions(req.query, { where: { name } }));
  res.json(device);
});

router.post('/:name/config', async (req, res) => {
  const { name } = req.params;
  const config = req.body;
  const device = await Device.findOne(convertQueryToOptions(req.query, { where: { name } }));
  if (device) device.config = config;
  await device?.save();
  res.sendStatus(200);
});

router.get('/:name/start', async (req, res) => {
  const { name } = req.params;
  const device = await Device.findOne(convertQueryToOptions(req.query, { relations: ['integration'], where: { name } }));

  if (!device) return res.sendStatus(404);

  const integration = await getIntegration(device.integration.name);
  integration.start(eventBus(device.uniqueId), serviceManager(device.uniqueId), device.config);

  device.activated = true;
  await device.save();

  res.sendStatus(200);
});

router.get('/:name/stop', async (req, res) => {
  const { name } = req.params;
  const device = await Device.findOne(convertQueryToOptions(req.query, { where: { name } }));

  if (!device) return res.sendStatus(404);

  const tasks = getTasks(device.uniqueId);
  tasks?.forEach((task) => task.stop());

  device.activated = false;
  await device.save();

  res.sendStatus(200);
});

// router.get('/:name/stop', async (req, res) => {
//   const { name } = req.params;
//   const addon = await Addon.findOne({ where: { name } });

//   if (!addon) return res.sendStatus(404);

//   addon.activated = false;
//   addon.save();
//   // AddonManager.stopTasks(addon.name);
//   stopTasks(addon.name);

//   res.sendStatus(200);
// });

// router.get('/:name/install', async (req, res) => {
//   const { name } = req.params;
//   installAddon(name);
//   const addon = await getAddon(name);
//   const details = getAddonDetails(name);

//   if (!addon || !details) return res.sendStatus(404);

//   await Addon.from({
//     ...details,
//     activated: false,
//     properties: addon.properties.map(({ name, description, value, unit, useHistory }) => Property.from({ name: name as string, description, value, unit, useHistory: useHistory })),
//   }).save();

//   res.sendStatus(200);
// });

// router.get('/:name/deinstall', async (req, res) => {
//   const { name } = req.params;

//   await (await Addon.findOneBy({ name }))?.remove();

//   res.sendStatus(200);
// });

export default router;
