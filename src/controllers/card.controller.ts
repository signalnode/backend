import express from 'express';
import { Card } from '../models/card.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const cards = await Card.find({
    // where: { id: 2 }, // TODO: Temporary
    relations: { properties: true },
  });

  res.json(cards);
});

export default router;
