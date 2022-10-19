import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../services/database';

export interface AddonModel extends Model<InferAttributes<AddonModel>, InferCreationAttributes<AddonModel>> {
  id: CreationOptional<number>;
  uuid: string;
  name: string;
  description: string;
  version: string;
  author: string;
  wiki?: string;
  config: object;
}

export const Addon = db.define<AddonModel>('Addon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.UUID,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wiki: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});
