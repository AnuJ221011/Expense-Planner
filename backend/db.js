require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    // Connect to the database
    await pool.connect();
    console.log('Database connected successfully');

    // Create User table if it doesn't exist
    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUserTableQuery);
    console.log('User table is ready');

    // Create Income table
    const createIncomeTableQuery = `
      CREATE TABLE IF NOT EXISTS "Income" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
        source VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createIncomeTableQuery);
    console.log('Income table is ready');

    // Create Expenses table
    const createExpensesTableQuery = `
      CREATE TABLE IF NOT EXISTS "Expenses" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
        source VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;   
    await pool.query(createExpensesTableQuery);
    console.log('Expenses table is ready'); 

    // Create Savings Goals table
    const createSavingsGoalsTableQuery = `
      CREATE TABLE IF NOT EXISTS "SavingsGoals" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        goal_name VARCHAR(100) NOT NULL,
        target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
        current_amount DECIMAL(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
        is_achieved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        achieved_at TIMESTAMP NULL
      );
    `;
    await pool.query(createSavingsGoalsTableQuery);
    console.log('SavingsGoals table is ready');

    // Create Savings Transactions table
    const createSavingsTransactionsTableQuery = `
      CREATE TABLE IF NOT EXISTS "SavingsTransactions" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        goal_id INTEGER NOT NULL REFERENCES "SavingsGoals"(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
        transaction_date DATE NOT NULL,
        transaction_time TIME NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createSavingsTransactionsTableQuery);
    console.log('SavingsTransactions table is ready');

    console.log('Database initialization completed successfully!');
    
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

module.exports = {
  pool,
  initDB,
};