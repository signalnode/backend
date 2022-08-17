import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import moduleLoader from './services/module_loader';
import db from './services/database';

import InstallController from './controllers/install';
import AuthenticationController from './controllers/authentication';
import TokenController from './controllers/token';
import UserController from './controllers/users';

const port = process.env.SERVER_PORT || 3000;
const server = express();

// Middelware
server.use(cors());
server.use(express.json());
server.use(cookieParser());

// Routes
server.use('/install', InstallController);
server.use('/authenticate', AuthenticationController);
server.use('/token', TokenController);
server.use('/users', UserController);

server.listen(port, async () => {
  console.log('Try to load addons...');
  await moduleLoader();
  console.log('... modules loaded');

  console.log(`Server is running on port ${port}`);

  await db.authenticate();
});
