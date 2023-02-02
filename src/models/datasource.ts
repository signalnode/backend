import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user.model';
import { Addon } from './addon.model';
import { Property } from './property.model';
import { History } from './history.model';

export default new DataSource({
  type: 'sqlite',
  database: './signalnode.sqlite',
  entities: [User, Addon, Property, History],
  synchronize: true,
  logging: false,
});
