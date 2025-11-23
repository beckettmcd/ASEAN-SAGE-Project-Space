import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  budgetLine: {
    type: DataTypes.STRING,
    comment: 'Budget line code'
  },
  fiscalYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  allocatedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  committedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  actualSpend: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  forecast: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  isPBRFlagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default Budget;

