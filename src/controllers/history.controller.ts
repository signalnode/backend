import express from 'express';
import { convertQueryToOptions } from '../helpers/query-helper';
import { Device } from '../models/device.model';
import { History } from '../models/history.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const history = await History.find(convertQueryToOptions(req.query));
  res.json(history);
});

router.post('/', async (req, res) => {
  const { propertyId, from, to } = req.body;

  const history = await History.find({
    where: { property: { id: propertyId } }, // TODO: Temporary
  });

  res.json(history);
});

export default router;
