import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LoEEntry = sequelize.define('LoEEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  days: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  isTravel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvedBy: {
    type: DataTypes.UUID
  },
  approvedDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

export default LoEEntry;

