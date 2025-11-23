import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Issue = sequelize.define('Issue', {
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
  category: {
    type: DataTypes.STRING
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open'
  },
  assignedTo: {
    type: DataTypes.UUID
  },
  raisedDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  targetResolutionDate: {
    type: DataTypes.DATE
  },
  resolvedDate: {
    type: DataTypes.DATE
  },
  resolution: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default Issue;

