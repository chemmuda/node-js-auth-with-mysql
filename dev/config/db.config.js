const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('school', 'chemist', 'Lilly2024', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
