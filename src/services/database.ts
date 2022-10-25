// import { Pool } from 'pg';
import { Sequelize } from 'sequelize';

const config = {
  host: process.env.DATABASE_HOST!,
  database: process.env.DATABASE_NAME!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  port: parseInt(process.env.DATABASE_PORT!),
};

// TODO: Implement better exception handling
if (!config.host) throw new Error('DatabaseHostUndefined');
if (!config.database) throw new Error('DatabaseDBUndefined');
if (!config.user) throw new Error('DatabaseUserUndefined');
if (!config.password) throw new Error('DatabasePasswordUndefined');
if (!config.port) throw new Error('DatabasePortUndefined');

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'postgres',
});

export default sequelize;
