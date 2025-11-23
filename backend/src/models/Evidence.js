import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Evidence = sequelize.define('Evidence', {
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
  type: {
    type: DataTypes.STRING,
    comment: 'Document, Photo, Data, Report, etc.'
  },
  collectionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING
  },
  filePath: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  }
}, {
  timestamps: true
});

export default Evidence;

