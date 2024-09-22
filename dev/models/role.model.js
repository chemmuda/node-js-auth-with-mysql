const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Role = sequelize.define('roles', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
  created_at: {type: DataTypes.DATE},
  updated_at: {type: DataTypes.DATE}
});

module.exports = Role;
