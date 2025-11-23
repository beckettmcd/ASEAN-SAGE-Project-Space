import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Supplier = sequelize.define('Supplier', {
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
    comment: 'Individual, Company, Institution'
  },
  registrationNumber: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  contactPerson: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  bankDetails: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Supplier;

