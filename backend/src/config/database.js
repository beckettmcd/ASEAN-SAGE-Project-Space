import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use SQLite for demo (easier setup without PostgreSQL server)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sage_tracker.db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

export default sequelize;

