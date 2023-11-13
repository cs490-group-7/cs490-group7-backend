const initialSurveyModel = require('../models/clientinitialSurveyModel');

const addInitialSurvey = async (req, res) => {
  try {
    const {
      user_id,
      date_of_birth,
      gender,
      height,
      weight,
      fitness_goal,
    } = req.body;

    const survey = await initialSurveyModel.create({
      user_id,
      date_of_birth,
      gender,
      height,
      weight,
      fitness_goal,
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