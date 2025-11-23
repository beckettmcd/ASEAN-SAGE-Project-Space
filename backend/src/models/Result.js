import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reportingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  maleBeneficiaries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  femaleBeneficiaries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  disabilityBeneficiaries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ooscyBeneficiaries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT
  },
  verificationSource: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

export default Result;

