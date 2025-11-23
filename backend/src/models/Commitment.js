import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Commitment = sequelize.define('Commitment', {
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
  description: {
    type: DataTypes.TEXT
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  commitmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expectedPaymentDate: {
    type: DataTypes.DATE
  },
  actualPaymentDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active'
  }
}, {
  timestamps: true
});

export default Commitment;

