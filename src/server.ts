import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import moduleLoader from './services/module_loader';
import db from './services/database';

import { validateToken } from './middleware/authentication';

import InstallController from './controllers/install';
import AuthenticationController from './controllers/authentication';
import LogoutController from './controllers/logout';
import RenewController from './controllers/renew';
import UserController from './controllers/user';
import AddonController from './controllers/addon';

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
  console.log('Try to load addons...');
  await moduleLoader(__dirname);
  console.log('... modules loaded');

  console.log(`Server is running on port ${port}`);

  await db.authenticate();
});
