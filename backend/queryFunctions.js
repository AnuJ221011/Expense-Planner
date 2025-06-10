const { pool } = require('./db');

// Income Analytics Queries
const getIncomeByCategory = {
  // Today's income by category
  today: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Income"
      WHERE user_id = $1 AND transaction_date = CURRENT_DATE
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This week's income by category
  thisWeek: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Income"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('week', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This month's income by category
  thisMonth: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Income"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This year's income by category
  thisYear: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Income"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('year', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
};

// Income amount vs date for current month (line graph)
const getIncomeByDateThisMonth = async (userId) => {
  const query = `
    SELECT transaction_date, SUM(amount) as total_amount
    FROM "Income"
    WHERE user_id = $1 
      AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY transaction_date
    ORDER BY transaction_date;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Expense Analytics Queries
const getExpensesByCategory = {
  // Today's expenses by category
  today: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Expenses"
      WHERE user_id = $1 AND transaction_date = CURRENT_DATE
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This week's expenses by category
  thisWeek: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Expenses"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('week', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This month's expenses by category
  thisMonth: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Expenses"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // This year's expenses by category
  thisYear: async (userId) => {
    const query = `
      SELECT category, SUM(amount) as total_amount
      FROM "Expenses"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('year', CURRENT_DATE)
        AND transaction_date < DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
};

// Expense amount vs date for current month (line graph)
const getExpensesByDateThisMonth = async (userId) => {
  const query = `
    SELECT transaction_date, SUM(amount) as total_amount
    FROM "Expenses"
    WHERE user_id = $1 
      AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND transaction_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY transaction_date
    ORDER BY transaction_date;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};


module.exports = {
  getIncomeByCategory,
  getIncomeByDateThisMonth,
  getExpensesByCategory,
  getExpensesByDateThisMonth,
};