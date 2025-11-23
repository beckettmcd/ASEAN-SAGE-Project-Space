import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    defaultValue: 'ASEAN'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Country;

