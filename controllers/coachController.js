const initialSurveyModel = require('../models/coachInitialSurveyModel');

const addCoachSurvey = async (req, res) => {
  try {
    const {
      user_id,
      certifications,
      experience,
      specializations,
    } = req.body;

    const survey = await initialSurveyModel.create({
      user_id,
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
  addCoachSurvey,
};
