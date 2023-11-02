const { DataTypes } = require('sequelize');
const sequelize = require('../db_connection.js');

const ClientInitialSurvey = sequelize.define('ClientInitialSurvey', {
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
  },
  height: {
    type: DataTypes.FLOAT,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  fitnessGoal: {
    type: DataTypes.STRING,
  },
  // Add client-specific attributes here
});

module.exports = ClientInitialSurvey;
