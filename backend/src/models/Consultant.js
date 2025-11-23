import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Consultant = sequelize.define('Consultant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  nationality: {
    type: DataTypes.STRING
  },
  expertise: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('expertise');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('expertise', JSON.stringify(value || []));
    }
  },
  dayRate: {
    type: DataTypes.DECIMAL(10, 2)
  },
  cvPath: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Consultant;

