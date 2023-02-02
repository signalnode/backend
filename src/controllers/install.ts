import express from 'express';
import bcrypt from 'bcrypt';
import { Addon } from '../models/addon.model';
import { User } from '../models/user.model';
import { Property } from '../models/property.model';
import { History } from '../models/history.model';

const router = express.Router();

router.get('/', async (req, res) => {
  // This is only for dev
  try {
    await User.create({ username: 'dev', passphrase: bcrypt.hashSync('dev', 10) }).save();
  } catch (e) {
    console.error(e);
  }

  //   try {
  //     await Addon.create({
  //       name: 'TestAddon',
  //       description: 'Description for TestAddon',
  //       version: '0.0.0',
  //       activated: false,
  //       author: 'SignalNode',
  //       properties: [
  //         Property.create({ name: 'prop1', description: 'Description for prop1', value: 1, unit: '---', useHistory: false }),
  //         Property.create({
  //           name: 'prop2',
  //           description: 'Description for prop2',
  //           value: 2,
  //           unit: '---',
  //           useHistory: true,
  //           history: [History.create({ value: 0, timestamp: Date.now() }), History.create({ value: 1, timestamp: Date.now() })],
  //         }),
  //       ],
  //     }).save();
  //   } catch (e) {
  //     console.error(e);
  //   }

    res.sendStatus(200);
});

export default router;
