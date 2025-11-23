import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DonorOrganisation = sequelize.define('DonorOrganisation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  logoUrl: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING
  },
  primaryContact: {
    type: DataTypes.STRING
  },
  contactEmail: {
    type: DataTypes.STRING
  },
  contactPhone: {
    type: DataTypes.STRING
  },
  organizationType: {
    type: DataTypes.STRING,
    defaultValue: 'bilateral'
  }
}, {
  timestamps: true
});

export default DonorOrganisation;
