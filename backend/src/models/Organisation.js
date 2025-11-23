import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Organisation = sequelize.define('Organisation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Donor, Implementer, Government, ASEAN Body'
  },
  country: {
    type: DataTypes.STRING
  },
  contactPerson: {
    type: DataTypes.STRING
  },
  contactEmail: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Organisation;

