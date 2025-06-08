// routes/balanceRoutes.js
const express = require('express');
const router = express.Router();
const { getBalanceData, getMonthlyIncomeTransactions } = require('../controllers/balanceController');

// Middleware for authentication (adjust based on your auth setup)
const authenticateUser = (req, res, next) => {
  // Add your authentication logic here
  // For now, assuming user info is available in req.user
  next();
};

// GET /api/balance/:userId - Get balance data for a specific user
router.get('/:userId', authenticateUser, getBalanceData);

// GET /api/balance/:userId/transactions - Get monthly income transactions
router.get('/:userId/transactions', authenticateUser, getMonthlyIncomeTransactions);

// If you have global auth middleware, you can also use:
// GET /api/balance - Get balance data for authenticated user
router.get('/', authenticateUser, getBalanceData);

module.exports = router;

