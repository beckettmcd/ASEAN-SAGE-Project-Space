import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Deliverable = sequelize.define('Deliverable', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  dueDate: {
    type: DataTypes.DATE
  },
  submittedDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  qualityRating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  reviewNotes: {
    type: DataTypes.TEXT
  },
  filePath: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

export default Deliverable;

