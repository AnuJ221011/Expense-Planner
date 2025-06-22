// routes/balanceRoutes.js
const express = require('express');
const router = express.Router();
const { getBalanceData, getMonthlyIncomeTransactions } = require('../controllers/balanceController');

const authenticateUser = (req, res, next) => {
  // Add your authentication logic here
  next();
};

// GET /api/balance/:userId - Get balance data for a specific user
router.get('/:userId', authenticateUser, getBalanceData);

// GET /api/balance/:userId/transactions - Get monthly income transactions
router.get('/:userId/transactions', authenticateUser, getMonthlyIncomeTransactions);


module.exports = router;

