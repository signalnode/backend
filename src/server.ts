import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import db from './services/database';

import { validateToken } from './middleware/authentication';

import cron from 'node-cron';
import AddonController from './controllers/addon';
import AuthenticationController from './controllers/authentication';
import InstallController from './controllers/install';
import LogoutController from './controllers/logout';
import RenewController from './controllers/renew';
import UserController from './controllers/user';
import { Addon } from './models/addon';
import ModuleManager from './services/module_manager';

import './models/associations';
import { Entity } from './models/entity';

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

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    await db.authenticate();
    const addons = await Addon.findAll();

    for (const addon of addons) {
      const module = await ModuleManager.initialize(addon.name);

      if (!addon.disabled && module.getEntities) {
        for (const entity of module.getEntities()) {
          if (entity.job && entity.interval) {
            cron.schedule(entity.interval.join(' '), () => {
              const res = entity.job!(addon.config);
              console.log('Async:', res);
              // Entity.update({ type: typeof res, value: res }, { where: { addonId: addon.id } });
            });
          }
        }
      }
    }
  } catch (err) {
    console.log('==============');

    if (err instanceof Error) {
      console.log(err.message);
    }
    console.error(err);
  }
});
