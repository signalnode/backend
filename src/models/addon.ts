import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../services/database';

export interface AddonModel extends Model<InferAttributes<AddonModel>, InferCreationAttributes<AddonModel>> {
  id: CreationOptional<number>;
  name: string;
  description: string;
  version: string;
  disabled: boolean;
  author: string;
  wiki?: string;
  config?: object;
}

export const Addon = db.define<AddonModel>('Addon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  disabled: {
    type: DataTypes.BOOLEAN,
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
