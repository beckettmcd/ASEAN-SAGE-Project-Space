import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ToR = sequelize.define('ToR', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  objectives: {
    type: DataTypes.TEXT
  },
  deliverables: {
    type: DataTypes.TEXT
  },
  qualifications: {
    type: DataTypes.TEXT
  },
  estimatedLoE: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Level of Effort in days'
  },
  dailyRate: {
    type: DataTypes.DECIMAL(10, 2)
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(15, 2)
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Draft'
  },
  approvedBy: {
    type: DataTypes.UUID
  },
  approvedDate: {
    type: DataTypes.DATE
  },
  rejectionReason: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default ToR;

