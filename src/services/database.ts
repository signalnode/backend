// import { Pool } from 'pg';
import { Sequelize } from 'sequelize';

const config = {
  host: process.env.DATABASE_HOST!,
  database: process.env.DATABASE_NAME!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  port: parseInt(process.env.DATABASE_PORT!),
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'postgres',
});

export default sequelize;
