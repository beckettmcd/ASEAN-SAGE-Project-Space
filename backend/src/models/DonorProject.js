import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DonorProject = sequelize.define('DonorProject', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalBudget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active'
  },
  isRegional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  focusAreas: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  keyContacts: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

export default DonorProject;
