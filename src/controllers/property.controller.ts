import express from 'express';
import { Property } from '../models/property.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

export default router;
