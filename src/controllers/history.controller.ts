import express from 'express';
import { Between } from 'typeorm';
import { History } from '../models/history.model';

const router = express.Router();

router.post('/', async (req, res) => {
  const { propertyId, from, to } = req.body;

  const history = await History.find({
    where: { property: { id: propertyId } }, // TODO: Temporary
  });

  res.json(history);
});

export default router;
