const express = require('express');
const AccountController = require('../controllers/accountController');
const router = express.Router();


router.post('/get-account-info', async (req, res) => {
  try {
    const userId = req.body.userId;
    const accountInfo = await AccountController.getAccountInfo(userId);

    res.status(200).json(accountInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/update-account-info', async (req, res) => {
  try {
    const inputData = req.body;
    const result = await AccountController.updateAccountInfo(inputData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
