import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import datasource from './models/datasource';

import { validateToken } from './middleware/authentication';

import AddonController from './controllers/addon';
import AuthenticationController from './controllers/authentication';
import InstallController from './controllers/install';
import LogoutController from './controllers/logout';
import RenewController from './controllers/renew';
import UserController from './controllers/user';
import { getAddon, registerAddonTasks, registerPropertyTasks } from './helpers/addon_helper';
import { Addon } from './models/addon.model';

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
});
