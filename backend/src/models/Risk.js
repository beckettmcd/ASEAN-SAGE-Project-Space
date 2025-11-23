import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Risk = sequelize.define('Risk', {
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
    type: DataTypes.STRING,
    comment: 'Strategic, Operational, Financial, Reputational, Safeguarding'
  },
  likelihood: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  impact: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  riskScore: {
    type: DataTypes.INTEGER,
    comment: 'Calculated as likelihood × impact'
  },
  mitigation: {
    type: DataTypes.TEXT
  },
  mitigationOwner: {
    type: DataTypes.UUID
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open'
  },
  reviewDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: (risk) => {
      risk.riskScore = risk.likelihood * risk.impact;
    }
  }
});

export default Risk;

