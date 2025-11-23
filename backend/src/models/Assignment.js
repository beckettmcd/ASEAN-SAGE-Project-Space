import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Assignment = sequelize.define('Assignment', {
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
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contractedLoE: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Contracted Level of Effort in days'
  },
  actualLoE: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Actual Level of Effort used'
  },
  dailyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalValue: {
    type: DataTypes.DECIMAL(15, 2)
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Planned'
  },
  mobilisationDate: {
    type: DataTypes.DATE
  },
  location: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  counterpartOrganisation: {
    type: DataTypes.STRING,
    comment: 'Government ministry or NGO partner'
  },
  counterpartContact: {
    type: DataTypes.STRING,
    comment: 'Contact person at partner organisation'
  },
  counterpartType: {
    type: DataTypes.STRING,
    comment: 'Government, Local NGO, International NGO, Private Sector'
  },
  counterpartEmail: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

export default Assignment;

