import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/user.model';
import { Integration } from './models/integration.model';
import { Property } from './models/property.model';
import { History } from './models/history.model';
import { Card } from './models/card.model';
import { Device } from './models/device.model';
import { CardConfig } from './models/card-config.model';

export default new DataSource({
  type: 'sqlite',
  database: './signalnode.sqlite',
  entities: [User, Integration, Device, Property, History, Card, CardConfig],
  synchronize: true,
  logging: false,

  //   migrations: [__dirname + '/../migrations/*.ts'],
  //   migrationsRun: false,
});
