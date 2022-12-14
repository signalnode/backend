import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../services/database';

class Addon extends Model<InferAttributes<Addon>, InferCreationAttributes<Addon>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare version: string;
  declare disabled: boolean;
  declare author: string;
  declare config?: object;
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
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'addons',
  }
);

export { Addon };
