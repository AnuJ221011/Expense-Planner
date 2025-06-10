require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { initDB } = require('./db');
const balanceRoutes = require('./routes/balanceRoutes');
const transactionRoutes = require('./routes/transactions');
const savingsRoutes = require('./routes/savings');
const recentTransactionRoutes = require('./routes/recentTransaction'); 
const analyticsRoutes = require('./routes/analytics'); 


// Initialize the database
initDB()
  .then(() => console.log('Database initialized successfully'))
  .catch(err => console.error('Database initialization failed:', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/routes/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api', transactionRoutes); 
app.use('/api/savings', savingsRoutes);
app.use('/api', recentTransactionRoutes);
app.use('/api', analyticsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
