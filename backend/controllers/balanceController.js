// controllers/balanceController.js
const { pool } = require('../db');

const getBalanceData = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Current month's income
    const incomeQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) as monthly_income,
        COUNT(*) as transaction_count
      FROM "Income" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `;
    const incomeResult = await pool.query(incomeQuery, [userId, currentMonth, currentYear]);
    const monthlyIncome = parseFloat(incomeResult.rows[0].monthly_income) || 0;

    // Current month's expenses
    const expensesQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) as monthly_expenses,
        COUNT(*) as transaction_count
      FROM "Expenses" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `;
    const expensesResult = await pool.query(expensesQuery, [userId, currentMonth, currentYear]);
    const monthlyExpenses = parseFloat(expensesResult.rows[0].monthly_expenses) || 0;

    //Current Month's savings
    const savingsQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) as monthly_savings,
        COUNT(*) as transaction_count
      FROM "SavingsTransactions" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `;
    const savingsResult = await pool.query(savingsQuery, [userId, currentMonth, currentYear]);
    const monthlySavings = parseFloat(savingsResult.rows[0].monthly_savings) || 0;

    // Total income, expenses and savings (all-time)
    const totalIncomeResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_income
      FROM "Income" 
      WHERE user_id = $1
    `, [userId]);
    const totalIncome = parseFloat(totalIncomeResult.rows[0].total_income) || 0;

    const totalExpensesResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM "Expenses" 
      WHERE user_id = $1
    `, [userId]);
    const totalExpenses = parseFloat(totalExpensesResult.rows[0].total_expenses) || 0;

    const totalSavingsResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_savings
      FROM "SavingsTransactions" 
      WHERE user_id = $1
    `, [userId]);
    const totalSavings = parseFloat(totalSavingsResult.rows[0].total_savings) || 0;

    // Previous month
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const prevIncomeResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as prev_income
      FROM "Income" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `, [userId, prevMonth, prevYear]);
    const prevMonthIncome = parseFloat(prevIncomeResult.rows[0].prev_income) || 0;

    const prevExpensesResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as prev_expenses
      FROM "Expenses" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `, [userId, prevMonth, prevYear]);
    const prevMonthExpenses = parseFloat(prevExpensesResult.rows[0].prev_expenses) || 0;

    const prevSavingsResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as prev_savings
      FROM "SavingsTransactions" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `, [userId, prevMonth, prevYear]);
    const prevMonthSavings = parseFloat(prevSavingsResult.rows[0].prev_savings) || 0;


    // % change calculations
    let incomePercentageChange = 0;
    if (prevMonthIncome > 0) {
      incomePercentageChange = ((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100;
    } else if (monthlyIncome > 0) {
      incomePercentageChange = 100;
    }

    let expensesPercentageChange = 0;
    if (prevMonthExpenses > 0) {
      expensesPercentageChange = ((monthlyExpenses - prevMonthExpenses) / prevMonthExpenses) * 100;
    } else if (monthlyExpenses > 0) {
      expensesPercentageChange = 100;
    }

    let savingsPercentageChange = 0;
    if (prevMonthSavings > 0) {
      savingsPercentageChange = ((monthlySavings - prevMonthSavings) / prevMonthSavings) * 100;
    } else if (monthlySavings > 0) {
      savingsPercentageChange = 100;
    }


    const availableBalance = totalIncome + totalSavings - totalExpenses;

    const balanceData = {
      total: availableBalance,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: monthlySavings,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      totalSavings: totalSavings,
      incomePercentageChange: parseFloat(incomePercentageChange.toFixed(2)),
      expensesPercentageChange: parseFloat(expensesPercentageChange.toFixed(2)),
      savingsPercentageChange: parseFloat(savingsPercentageChange.toFixed(2)),
      transactionCount: parseInt(incomeResult.rows[0].transaction_count ) + parseInt(expensesResult.rows[0].transaction_count) + parseInt(savingsResult.rows[0].transaction_count),
    };

    res.json({
      success: true,
      data: balanceData,
      message: 'Balance data retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching balance data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve balance data'
    });
  }
};

// Monthly income transactions
const getMonthlyIncomeTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const transactionsQuery = `
      SELECT 
        id,
        amount,
        source,
        category,
        transaction_date,
        transaction_time,
        created_at
      FROM "Income" 
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3
      ORDER BY transaction_date DESC, transaction_time DESC
    `;

    const result = await pool.query(transactionsQuery, [userId, currentMonth, currentYear]);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      message: 'Monthly income transactions retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching monthly transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getBalanceData,
  getMonthlyIncomeTransactions
};
    