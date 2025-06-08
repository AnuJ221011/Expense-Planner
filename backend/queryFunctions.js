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

// Savings Analytics Queries
const getSavingsAnalytics = {
  // Get all savings goals with progress
  getAllGoals: async (userId) => {
    const query = `
      SELECT 
        id,
        goal_name,
        target_amount,
        current_amount,
        ROUND((current_amount / target_amount * 100), 2) as progress_percentage,
        is_achieved,
        created_at,
        achieved_at
      FROM "SavingsGoals"
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get savings transactions for a specific goal
  getGoalTransactions: async (goalId) => {
    const query = `
      SELECT 
        st.*,
        sg.goal_name
      FROM "SavingsTransactions" st
      JOIN "SavingsGoals" sg ON st.goal_id = sg.id
      WHERE st.goal_id = $1
      ORDER BY st.transaction_date DESC, st.transaction_time DESC;
    `;
    const result = await pool.query(query, [goalId]);
    return result.rows;
  },

  // Get total savings by month for current year
  getSavingsByMonth: async (userId) => {
    const query = `
      SELECT 
        DATE_TRUNC('month', transaction_date) as month,
        SUM(amount) as total_saved
      FROM "SavingsTransactions"
      WHERE user_id = $1 
        AND transaction_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', transaction_date)
      ORDER BY month;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
};

// CRUD Operations for Income
const incomeOperations = {
  create: async (userId, amount, source, category, date, time) => {
    const query = `
      INSERT INTO "Income" (user_id, amount, source, category, transaction_date, transaction_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, amount, source, category, date, time]);
    return result.rows[0];
  },

  getAll: async (userId) => {
    const query = `
      SELECT * FROM "Income"
      WHERE user_id = $1
      ORDER BY transaction_date DESC, transaction_time DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  update: async (id, amount, source, category, date, time) => {
    const query = `
      UPDATE "Income"
      SET amount = $2, source = $3, category = $4, transaction_date = $5, transaction_time = $6
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id, amount, source, category, date, time]);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM "Income" WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

// CRUD Operations for Expenses
const expenseOperations = {
  create: async (userId, amount, source, category, date, time) => {
    const query = `
      INSERT INTO "Expenses" (user_id, amount, source, category, transaction_date, transaction_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, amount, source, category, date, time]);
    return result.rows[0];
  },

  getAll: async (userId) => {
    const query = `
      SELECT * FROM "Expenses"
      WHERE user_id = $1
      ORDER BY transaction_date DESC, transaction_time DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  update: async (id, amount, source, category, date, time) => {
    const query = `
      UPDATE "Expenses"
      SET amount = $2, source = $3, category = $4, transaction_date = $5, transaction_time = $6
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id, amount, source, category, date, time]);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM "Expenses" WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

// CRUD Operations for Savings Goals
const savingsGoalOperations = {
  create: async (userId, goalName, targetAmount) => {
    const query = `
      INSERT INTO "SavingsGoals" (user_id, goal_name, target_amount)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, goalName, targetAmount]);
    return result.rows[0];
  },

  getAll: async (userId) => {
    const query = `
      SELECT * FROM "SavingsGoals"
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  addMoney: async (userId, goalId, amount, date, time, notes = null) => {
    const query = `
      INSERT INTO "SavingsTransactions" (user_id, goal_id, amount, transaction_date, transaction_time, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, goalId, amount, date, time, notes]);
    return result.rows[0];
  }
};const getIncomeByDateForMonth = async (userId, year, month) => {
  const query = `
    SELECT transaction_date, SUM(amount) as total_amount
    FROM "Income"
    WHERE user_id = $1 
      AND transaction_date >= $2
      AND transaction_date < $3
    GROUP BY transaction_date
    ORDER BY transaction_date;
  `;
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const result = await pool.query(query, [userId, startDate, endDate]);
  return result.rows;
};



module.exports = {
  getIncomeByCategory,
  getIncomeByDateThisMonth,
  getExpensesByCategory,
  getExpensesByDateThisMonth,
  getSavingsAnalytics,
  incomeOperations,
  expenseOperations,
  savingsGoalOperations,
  getIncomeByDateForMonth
};