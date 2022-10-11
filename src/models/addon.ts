import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../services/database';

interface AddonModel extends Model<InferAttributes<AddonModel>, InferCreationAttributes<AddonModel>> {
  id: CreationOptional<number>;
  name: string;
  description: string;
  version: string;
  author: string;
  wiki: string;
  installed: boolean;
}

const Addon = db.define<AddonModel>('Addon', {
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
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wiki: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  installed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Addon;
