const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDb, pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Verify Database Connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL Database successfully.');
    connection.release();
    // Initialize Tables
    initDb();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Import Routes
const slidesRoutes = require('./routes/slides');
const newsRoutes = require('./routes/news');
const settingsRoutes = require('./routes/settings');

// Use Routes
app.use('/api/slides', slidesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
