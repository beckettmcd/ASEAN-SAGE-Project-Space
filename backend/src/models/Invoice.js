import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Draft'
  },
  paidDate: {
    type: DataTypes.DATE
  },
  approvedBy: {
    type: DataTypes.UUID
  },
  approvedDate: {
    type: DataTypes.DATE
  },
  filePath: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

export default Invoice;

