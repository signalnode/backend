import express from 'express';
import { getIntegrationDetails, installIntegration } from '../helpers/integration-helper';
import { Integration } from '../models/integration.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const integrations = await Integration.find();
  res.json(integrations);
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const integration = await Integration.findOne({ where: { name } });
  //   const npmAddon = await getAddon(name);

  //   if (!dbAddon || !npmAddon) return res.sendStatus(404);

  res.json(integration);
});

router.get('/:name/install', async (req, res) => {
  const { name } = req.params;
  const integration = await installIntegration(name);
  const details = getIntegrationDetails(name);

  //   if (!addon || !details) return res.sendStatus(404);

  await Integration.from({
    ...details,
    configSchema: integration?.configLayout,
    properties: integration?.properties,
  }).save();

  res.sendStatus(200);
});

router.get('/:name/deinstall', async (req, res) => {
  const { name } = req.params;

  //   await (await Addon.findOneBy({ name }))?.remove();

  res.sendStatus(200);
});

export default router;
