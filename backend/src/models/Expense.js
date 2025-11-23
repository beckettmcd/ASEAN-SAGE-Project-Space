import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Assignments',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.ENUM('Airfare', 'Accommodation', 'Meals', 'LocalTransport', 'Visa', 'PerDiem', 'Other'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  receiptReference: {
    type: DataTypes.STRING,
    comment: 'Receipt number or reference'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    comment: 'Currency code (USD, GBP, EUR, etc.)'
  },
  location: {
    type: DataTypes.STRING,
    comment: 'Where the expense was incurred'
  },
  vendor: {
    type: DataTypes.STRING,
    comment: 'Vendor or service provider'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Additional notes or comments'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['assignmentId']
    },
    {
      fields: ['category']
    },
    {
      fields: ['date']
    },
    {
      fields: ['status']
    }
  ]
});

export default Expense;
