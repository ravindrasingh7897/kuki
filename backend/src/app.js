import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import opengdsRoutes from './routes/opengds.js';

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running.' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/opengds', opengdsRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;