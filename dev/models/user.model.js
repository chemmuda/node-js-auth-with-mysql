const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM,
    values: ['Male', 'Female', 'other'],
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  physical_address: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reset_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id',
    },
    allowNull: false,
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }, 
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn('NOW'),
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.fn('NOW'),
    field: 'updated_at',
  }
});

module.exports = User;
