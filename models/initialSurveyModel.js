const { DataTypes } = require('sequelize');
const sequelize = require('../db_connection.js');

const InitialSurvey = sequelize.define('InitialSurvey', {
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
  certifications: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.STRING,
  },
  specializations: {
    type: DataTypes.STRING,
  },
});

module.exports = InitialSurvey;
