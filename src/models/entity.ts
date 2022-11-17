import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../services/database';
import { Addon } from './addon';

class Entity extends Model<InferAttributes<Entity>, InferCreationAttributes<Entity>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare value: string | number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare addonId: ForeignKey<Addon['id']>;
}

Entity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'entities',
  }
);

export { Entity };
