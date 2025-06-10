// Backend API endpoint - transactions.js or in your routes file

const express = require('express');
const router = express.Router();
const {pool} = require('../db'); // Adjust path to your database config

// GET /api/transactions/:userId - Fetch recent transactions for a user
router.get('/transactions/:userId', async (req, res) => {
  const { userId } = req.params;
  const limit = req.query.limit || 10; // Default to 10 recent transactions

  try {
    // Query to get recent transactions from both Income and Expenses tables
    const query = `
      (
        SELECT 
          id,
          'income' as type,
          amount,
          source as entity,
          category,
          transaction_date as date,
          transaction_time as time,
          created_at
        FROM "Income" 
        WHERE user_id = $1
      )
      UNION ALL
      (
        SELECT 
          id,
          'expense' as type,
          amount,
          source as entity,
          category,
          transaction_date as date,
          transaction_time as time,
          created_at
        FROM "Expenses" 
        WHERE user_id = $1
      )
      ORDER BY date DESC, time DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    
    // Transform the data to match your Transaction interface
    const transactions = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      amount: parseFloat(row.amount),
      entity: row.entity,
      category: row.category,
      date: row.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: row.time.substring(0, 5) // Format time as HH:MM
    }));

    console.log('Anuj checking date',transactions);

    res.json({
      success: true,
      transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
});

module.exports = router;