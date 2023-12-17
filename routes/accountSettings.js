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

router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;
    const message = await AccountController.changePassword(currentPassword, newPassword, userId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delete-account', async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const result = await AccountController.deleteAccountWithReason(userId, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

