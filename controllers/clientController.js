const initialSurveyModel = require('../models/clientinitialSurveyModel');

const addInitialSurvey = async (req, res) => {
  try {
    const {
      user_id,
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessGoal,
    } = req.body;

    const survey = await initialSurveyModel.create({
      user_id,
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