const initialSurveyModel = require('../models/initialSurveyModel');

const addInitialSurvey = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessGoal,
    } = req.body;

    const survey = await initialSurveyModel.create({
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessGoal,
    });

    res.status(201).json({ message: 'Client initial survey added successfully', survey });
  } catch (error) {
    console.error('Error adding client initial survey:', error);
    res.status(500).json({ error: 'Failed to add client initial survey' });
  }
};

module.exports = {
  addInitialSurvey,
};