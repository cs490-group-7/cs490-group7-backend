const initialSurveyModel = require('../models/coachInitialSurveyModel');

const addInitialSurvey = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessGoal,
      certifications,
      experience,
      specializations,
    } = req.body;

    const survey = await initialSurveyModel.create({
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessGoal,
      certifications,
      experience,
      specializations,
    });

    res.status(201).json({ message: 'Initial survey added successfully', survey });
  } catch (error) {
    console.error('Error adding initial survey:', error);
    res.status(500).json({ error: 'Failed to add initial survey' });
  }
};

module.exports = {
  addInitialSurvey,
};
