import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mqtt from 'mqtt';

import datasource from './models/datasource';

import { validateToken } from './middleware/authentication';

import AddonController from './controllers/addon';
import CardController from './controllers/card.controller';
import HistoryController from './controllers/history.controller';
import AuthenticationController from './controllers/authentication';
import InstallController from './controllers/install';
import LogoutController from './controllers/logout';
import RenewController from './controllers/renew';
import UserController from './controllers/user';
import { getAddon, registerAddonTasks, registerPropertyTasks } from './helpers/addon_helper';
import { Addon } from './device.model';

const port = process.env.SERVER_PORT || 3000;
const server = express();

// Middelware
server.use(cors());
server.use(express.json());
server.use(cookieParser());

// Routes
server.use('/install', InstallController);
server.use('/authenticate', AuthenticationController);
server.use('/logout', LogoutController);
server.use('/renew', RenewController);
server.use('/users', validateToken, UserController);
server.use('/addons', validateToken, AddonController);
server.use('/cards', validateToken, CardController);
server.use('/history', validateToken, HistoryController);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    await datasource.initialize();

    const dbAddons = await Addon.find();

    for (const dbAddon of dbAddons) {
      const npmAddon = await getAddon(dbAddon.name);
      if (dbAddon.activated) {
        await npmAddon.start(dbAddon.config);
        registerAddonTasks(dbAddon.name, npmAddon.tasks ?? [], dbAddon.config, true);
        registerPropertyTasks(dbAddon.name, npmAddon.properties, dbAddon.config, true);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.error(err);
  }

  // const mqttClient = mqtt.connect('mqtt://signalnode.fritz.box', { username: process.env.MQTT_USER, password: process.env.MQTT_PASSWORD });
  // mqttClient.on('connect', () => {
  //   mqttClient.subscribe('#', (err) => console.log(err));
  // });
  // mqttClient.on('message', (topic, message) => {
  //   console.log('Topic', topic, 'Message', message.toString());
  // });
});
