import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Decision = sequelize.define('Decision', {
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
  decisionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  decisionMaker: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rationale: {
    type: DataTypes.TEXT
  },
  implications: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default Decision;

