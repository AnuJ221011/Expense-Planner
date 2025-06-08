const express = require('express');
const { pool } = require('../db'); // Adjust path based on your structure
const router = express.Router();

// Get all savings goals for a user
router.get('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT * FROM "SavingsGoals" 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

// Create a new savings goal
router.post('/goals', async (req, res) => {
  try {
    const { user_id, goal_name, target_amount } = req.body;
    
    // Validation
    if (!user_id || !goal_name || !target_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (target_amount <= 0) {
      return res.status(400).json({ error: 'Target amount must be greater than 0' });
    }
    
    const query = `
      INSERT INTO "SavingsGoals" (user_id, goal_name, target_amount)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, goal_name, target_amount]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating savings goal:', error);
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
});

// Update a savings goal
router.put('/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { goal_name, target_amount } = req.body;
    
    const query = `
      UPDATE "SavingsGoals" 
      SET goal_name = $1, target_amount = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [goal_name, target_amount, goalId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating savings goal:', error);
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// Delete a savings goal
router.delete('/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    
    const query = 'DELETE FROM "SavingsGoals" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [goalId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    
    res.json({ message: 'Savings goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

// Add money to a savings goal (create savings transaction)
router.post('/transactions', async (req, res) => {
  try {
    const { user_id, goal_id, amount, notes } = req.body;
    
    // Validation
    if (!user_id || !goal_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    // Check if goal exists and belongs to user
    const goalCheck = await pool.query(
      'SELECT * FROM "SavingsGoals" WHERE id = $1 AND user_id = $2',
      [goal_id, user_id]
    );
    
    if (goalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }
    
    const query = `
      INSERT INTO "SavingsTransactions" 
      (user_id, goal_id, amount, transaction_date, transaction_time, notes)
      VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, goal_id, amount, notes]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating savings transaction:', error);
    res.status(500).json({ error: 'Failed to add money to savings goal' });
  }
});

// Get savings transactions for a user
router.get('/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { goalId } = req.query;
    
    let query = `
      SELECT st.*, sg.goal_name 
      FROM "SavingsTransactions" st
      JOIN "SavingsGoals" sg ON st.goal_id = sg.id
      WHERE st.user_id = $1
    `;
    
    const params = [userId];
    
    if (goalId) {
      query += ' AND st.goal_id = $2';
      params.push(goalId);
    }
    
    query += ' ORDER BY st.transaction_date DESC, st.transaction_time DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching savings transactions:', error);
    res.status(500).json({ error: 'Failed to fetch savings transactions' });
  }
});

// Get savings summary for a user
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        COUNT(*) as total_goals,
        COUNT(CASE WHEN is_achieved = true THEN 1 END) as achieved_goals,
        COALESCE(SUM(target_amount), 0) as total_target,
        COALESCE(SUM(current_amount), 0) as total_saved,
        COALESCE(AVG(CASE WHEN target_amount > 0 THEN (current_amount / target_amount) * 100 END), 0) as avg_progress
      FROM "SavingsGoals"
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching savings summary:', error);
    res.status(500).json({ error: 'Failed to fetch savings summary' });
  }
});

// Get savings transactions by date range
router.get('/transactions/:userId/range', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const query = `
      SELECT st.*, sg.goal_name 
      FROM "SavingsTransactions" st
      JOIN "SavingsGoals" sg ON st.goal_id = sg.id
      WHERE st.user_id = $1 
      AND st.transaction_date BETWEEN $2 AND $3
      ORDER BY st.transaction_date DESC, st.transaction_time DESC
    `;
    
    const result = await pool.query(query, [userId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching savings transactions by date range:', error);
    res.status(500).json({ error: 'Failed to fetch savings transactions' });
  }
});

module.exports = router;