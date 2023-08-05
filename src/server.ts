import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';

import datasource from './datasource';

import { validateToken } from './middleware/authentication';

import AuthenticationController from './controllers/authentication.controller';
import CardController from './controllers/card.controller';
import DeviceController from './controllers/device.controller';
import HistoryController from './controllers/history.controller';
import InstallController from './controllers/install';
import IntegrationController from './controllers/integration.controller';
import LogoutController from './controllers/logout.controller';
import PropertyController from './controllers/property.controller';
import RenewController from './controllers/renew.controller';
import UserController from './controllers/user.controller';
import { eventBus } from './core/event-bus';
import { serviceManager } from './core/service-manager';
import { getIntegration } from './helpers/integration-helper';
import { Device } from './models/device.model';

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
server.use('/logout', validateToken, LogoutController);
server.use('/users', validateToken, UserController);
server.use('/integrations', validateToken, IntegrationController);
server.use('/devices', validateToken, DeviceController);
server.use('/properties', PropertyController);
server.use('/cards', validateToken, CardController);
server.use('/history', HistoryController);

// Only for development
server.use('/store', (req, res) => res.sendFile(`${__dirname}/store.json`));

// server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err);
//   next();
// });

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    await datasource.initialize();

    const devices = await Device.find({ relations: ['integration'] });

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
