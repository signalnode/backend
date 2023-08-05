import express from 'express';
import { convertQueryToOptions } from '../helpers/query-helper';
import { Property } from '../models/property.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const properties = await Property.find(convertQueryToOptions(req.query));
  res.json(properties);
});

export default router;
