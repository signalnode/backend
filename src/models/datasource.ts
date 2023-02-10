import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user.model';
import { Addon } from '../device.model';
import { Property } from './property.model';
import { History } from './history.model';
import { Card } from './card.model';

export default new DataSource({
  type: 'sqlite',
  database: './signalnode.sqlite',
  entities: [User, Addon, Property, History, Card],
  synchronize: true,
  logging: false,
  //   migrations: [__dirname + '/../migrations/*.ts'],
  //   migrationsRun: false,
});
