import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mqtt from 'mqtt';

import datasource from './datasource';

import { validateToken } from './middleware/authentication';

import IntegrationController from './controllers/integration.controller';
import DeviceController from './controllers/device.controller';
import PropertyController from './controllers/property.controller';
import CardController from './controllers/card.controller';
import HistoryController from './controllers/history.controller';
import AuthenticationController from './controllers/authentication.controller';
import InstallController from './controllers/install';
import LogoutController from './controllers/logout.controller';
import RenewController from './controllers/renew.controller';
import UserController from './controllers/user.controller';
import { getAddon, registerAddonTasks, registerPropertyTasks } from './helpers/addon_helper';
import { Integration } from './models/integration.model';
import { Device } from './models/device.model';
import { serviceManager } from './core/service-manager';
import { eventBus } from './core/event-bus';
import { getIntegration } from './helpers/integration-helper';

const port = process.env.SERVER_PORT || 3000;
const server = express();

// Middelware
server.use(cors());
server.use(express.json());
server.use(cookieParser());

// Routes
server.use('/install', InstallController);
server.use('/authenticate', AuthenticationController);
server.use('/renew', RenewController);
server.use('/logout', LogoutController);
server.use('/users', validateToken, UserController);
server.use('/integrations', validateToken, IntegrationController);
server.use('/devices', validateToken, DeviceController);
server.use('/properties', validateToken, PropertyController);
server.use('/cards', validateToken, CardController);
server.use('/history', validateToken, HistoryController);

// Only for development
server.use('/store', (req, res) => res.sendFile(`${__dirname}/store.json`));

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    await datasource.initialize();

    const devices = await Device.find();

    for (const device of devices) {
      const integration = await getIntegration(device.integration.name);
      if (device.activated) {
        //         await npmAddon.start(dbAddon.config);
        //         registerAddonTasks(dbAddon.name, npmAddon.tasks ?? [], dbAddon.config, true);
        //         registerPropertyTasks(dbAddon.name, npmAddon.properties, dbAddon.config, true);
        integration.start(eventBus(device.uniqueId), serviceManager(device.uniqueId), device.config);
      }
    }

    eventBus('system').on('*', console.log);
  } catch (err) {
    //     if (err instanceof Error) {
    //       console.error(err.message);
    //     }
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
