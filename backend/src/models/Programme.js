import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Programme = sequelize.define('Programme', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
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
  ragStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Green'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Programme;

