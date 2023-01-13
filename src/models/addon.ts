import { SignalNodeEntity } from '@signalnode/types';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../services/database';

export class Addon extends Model<InferAttributes<Addon>, InferCreationAttributes<Addon>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare version: string;
  declare activated: boolean;
  declare author: string;
  declare config?: object;
  declare entities: SignalNodeEntity<unknown, unknown>[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Addon.init(
  {
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
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    entities: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'addons',
  }
);

export const updateEntityValues = (addon: Addon, values: [unknown, string | number | boolean][]) => {
  values.forEach((value) => {
    const entity = addon.entities.find((e) => e.name === value[0]);
    if (entity) {
      if (!entity.history) entity.history = [];
      entity.history.push({ value: entity.value, timestamp: Date.now() });
      entity.value = value[1];
    }
  });
  addon.changed('entities', true);
  addon.save();
};
