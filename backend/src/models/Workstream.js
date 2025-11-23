import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workstream = sequelize.define('Workstream', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pillar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  ragStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Green'
  }
}, {
  timestamps: true
});

export default Workstream;

