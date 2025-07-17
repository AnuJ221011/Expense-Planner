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

const allowedOrigins = [
  'http://localhost:5174',
  'https://expense-planner-ten.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json());
app.use('/api/routes/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api', transactionRoutes); 
app.use('/api/savings', savingsRoutes);
app.use('/api', recentTransactionRoutes);
app.use('/api', analyticsRoutes);


app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false,
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
