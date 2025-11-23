import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SafeguardingIncident = sequelize.define('SafeguardingIncident', {
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
  incidentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reportedDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  actionTaken: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Under Investigation'
  },
  caseOwner: {
    type: DataTypes.UUID
  },
  isConfidential: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default SafeguardingIncident;

