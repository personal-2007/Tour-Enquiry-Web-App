const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { initDatabase } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP headers
app.use(helmet());

// Logging in dev
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, or allow configured origin
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Mount main API router
app.use('/api', routes);

// 404 Not Found handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Auto-initialize DB and listen if not running under test
if (process.env.NODE_ENV !== 'test') {
  initDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(` Tour Enquiry API Server running on port ${PORT}`);
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(` Health check: http://localhost:${PORT}/api/health`);
        console.log(`===============================================`);
      });
    })
    .catch((err) => {
      console.error('[Server Startup] Database connection warning:', err.message);
      // Still listen so frontend / health can connect while DB is configured
      app.listen(PORT, () => {
        console.log(`Tour Enquiry API Server running on port ${PORT} (Database pending connection)`);
      });
    });
}

module.exports = app;
