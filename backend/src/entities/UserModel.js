// src/entities/UserModel.js
const { DataTypes } = require('sequelize');
const sequelize = require("../frameworks/PgDatabase"); // importe como "sequelize", para usar abaixo

const UserModel = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // outras colunas aqui se quiser
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = UserModel;

