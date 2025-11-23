import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Lesson = sequelize.define('Lesson', {
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
    type: DataTypes.TEXT,
    allowNull: false
  },
  context: {
    type: DataTypes.TEXT
  },
  whatWorked: {
    type: DataTypes.TEXT
  },
  whatDidntWork: {
    type: DataTypes.TEXT
  },
  recommendations: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING
  },
  dateRecorded: {
    type: DataTypes.DATE,
    allowNull: false
  },
  recordedBy: {
    type: DataTypes.UUID
  }
}, {
  timestamps: true
});

export default Lesson;

