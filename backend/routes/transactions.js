const express = require('express');
// add auth
const router = express.Router();
const {pool} = require('../db'); // PostgreSQL pool connection

// Route for adding income
router.post('/income', async (req, res) => {
  const { user_id, amount, entity, category, date, time } = req.body;
  console.log('Adding income Anujbhj:', { user_id, amount, entity, category, date, time });

  try {
    const result = await pool.query(
      `INSERT INTO "Income" (user_id, amount, source, category, transaction_date, transaction_time)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, amount, entity, category, date, time]
    );

    res.status(201).json({ message: 'Income added', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting income:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding expense
router.post('/expense', async (req, res) => {
  const { user_id, amount, entity, category, date, time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO "Expenses" (user_id, amount, source, category, transaction_date, transaction_time)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, amount, entity, category, date, time]
    );

    res.status(201).json({ message: 'Expense added', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting expense:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
