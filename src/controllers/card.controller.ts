import express from 'express';
import { Card } from '../models/card.model';

const router = express.Router();

router.get('/', async (req, res) => {
  const cards = await Card.find({
    // where: { id: 2 }, // TODO: Temporary
    // relations: { properties: true },
  });

  return res.json(cards);
});

router.post('/', async (req, res) => {
  const { type, config }: Card = req.body;

  console.log(req.body);

  const card = await Card.from({ type, config }).save();

  return res.json(card);
});

export default router;
