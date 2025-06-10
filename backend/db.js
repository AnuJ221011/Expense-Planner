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

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_income_user_date ON "Income"(user_id, transaction_date);',
      'CREATE INDEX IF NOT EXISTS idx_income_category ON "Income"(category);',
      'CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON "Expenses"(user_id, transaction_date);',
      'CREATE INDEX IF NOT EXISTS idx_expenses_category ON "Expenses"(category);',
      'CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON "SavingsGoals"(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_savings_transactions_user_date ON "SavingsTransactions"(user_id, transaction_date);',
      'CREATE INDEX IF NOT EXISTS idx_savings_transactions_goal ON "SavingsTransactions"(goal_id);'
    ];

    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }
    console.log('Database indexes created successfully');

    // Create trigger functions and triggers
    const triggerFunctions = `
      -- Trigger function to update current_amount in SavingsGoals
      CREATE OR REPLACE FUNCTION update_savings_goal_amount()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE "SavingsGoals" 
        SET 
          current_amount = current_amount + NEW.amount,
          updated_at = CURRENT_TIMESTAMP,
          is_achieved = CASE 
            WHEN (current_amount + NEW.amount) >= target_amount AND NOT is_achieved 
            THEN TRUE 
            ELSE is_achieved 
          END,
          achieved_at = CASE 
            WHEN (current_amount + NEW.amount) >= target_amount AND NOT is_achieved 
            THEN CURRENT_TIMESTAMP 
            ELSE achieved_at 
          END
        WHERE id = NEW.goal_id;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Trigger function to update updated_at timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await pool.query(triggerFunctions);

    const triggers = [
      'DROP TRIGGER IF EXISTS savings_transaction_trigger ON "SavingsTransactions";',
      'CREATE TRIGGER savings_transaction_trigger AFTER INSERT ON "SavingsTransactions" FOR EACH ROW EXECUTE FUNCTION update_savings_goal_amount();',
      'DROP TRIGGER IF EXISTS update_income_updated_at ON "Income";',
      'CREATE TRIGGER update_income_updated_at BEFORE UPDATE ON "Income" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'DROP TRIGGER IF EXISTS update_expenses_updated_at ON "Expenses";',
      'CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON "Expenses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      'DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON "SavingsGoals";',
      'CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON "SavingsGoals" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
    ];

    for (const triggerQuery of triggers) {
      await pool.query(triggerQuery);
    }
    console.log('Database triggers created successfully');

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