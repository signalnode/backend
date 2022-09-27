import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '../services/database';

interface AddonModel extends Model<InferAttributes<AddonModel>, InferCreationAttributes<AddonModel>> {
  id: CreationOptional<number>;
  name: string;
  version: string;
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
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Addon;
