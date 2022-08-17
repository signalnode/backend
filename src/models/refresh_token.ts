import { DataTypes } from 'sequelize';
import db from '../services/database';

export default db.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});
