import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Fee = sequelize.define('Fee', {
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
  feeType: {
    type: DataTypes.ENUM('DailyRate', 'Milestone', 'Bonus', 'Adjustment'),
    allowNull: false,
    defaultValue: 'DailyRate'
  },
  periodStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  periodEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  days: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Number of days for this fee period'
  },
  rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Daily rate or fixed amount'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Calculated amount (days × rate for DailyRate, or fixed amount for others)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  invoiceReference: {
    type: DataTypes.STRING,
    comment: 'Invoice number or reference'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Paid'),
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
      fields: ['feeType']
    },
    {
      fields: ['periodStart', 'periodEnd']
    },
    {
      fields: ['status']
    }
  ]
});

export default Fee;
