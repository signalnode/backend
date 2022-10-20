import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import db from './services/database';

import { validateToken } from './middleware/authentication';

import InstallController from './controllers/install';
import AuthenticationController from './controllers/authentication';
import LogoutController from './controllers/logout';
import RenewController from './controllers/renew';
import UserController from './controllers/user';
import AddonController from './controllers/addon';
import { Addon } from './models/addon';
import ModuleManager from './services/module_manager';

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

  // installAddon('hello');
  // deinstallAddon('hello');

  try {
    await db.authenticate();
    const addons = await Addon.findAll();

    for (const addon of addons) {
      ModuleManager.initialize(addon.name);
    }
  } catch (err) {
    console.error(err);
  }
});
