const express = require('express');
const router = express.Router();
const {
  getIncomeByCategory,
  getIncomeByDateThisMonth,
  getExpensesByCategory,
  getExpensesByDateThisMonth
} = require('../queryFunctions'); 

// Income Analytics Routes

// Get income by category for different periods
router.get('/income/category/today/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getIncomeByCategory.today(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching today\'s income by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/income/category/thisWeek/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getIncomeByCategory.thisWeek(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this week\'s income by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/income/category/thisMonth/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getIncomeByCategory.thisMonth(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this month\'s income by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/income/category/thisYear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getIncomeByCategory.thisYear(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this year\'s income by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get income by date for current month
router.get('/income/monthly-dates/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getIncomeByDateThisMonth(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching monthly income dates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Expense Analytics Routes

// Get expenses by category for different periods
router.get('/expenses/category/today/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getExpensesByCategory.today(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching today\'s expenses by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/expenses/category/thisWeek/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getExpensesByCategory.thisWeek(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this week\'s expenses by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/expenses/category/thisMonth/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getExpensesByCategory.thisMonth(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this month\'s expenses by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/expenses/category/thisYear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getExpensesByCategory.thisYear(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching this year\'s expenses by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expenses by date for current month
router.get('/expenses/monthly-dates/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getExpensesByDateThisMonth(userId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching monthly expense dates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;