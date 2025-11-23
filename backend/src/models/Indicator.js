import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Indicator = sequelize.define('Indicator', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Outcome, Output, Activity'
  },
  description: {
    type: DataTypes.TEXT
  },
  unit: {
    type: DataTypes.STRING,
    comment: 'e.g., Number, Percentage, Score'
  },
  baseline: {
    type: DataTypes.DECIMAL(15, 2)
  },
  target: {
    type: DataTypes.DECIMAL(15, 2)
  },
  actual: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  pillar: {
    type: DataTypes.STRING
  },
  isGenderDisaggregated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDisabilityTagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isOOSCYRelated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default Indicator;

