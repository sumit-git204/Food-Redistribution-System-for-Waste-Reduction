import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import taxonomyRoutes from './routes/taxonomyRoutes.js';
import { initExpiryCron, runExpiryScan } from './services/expiryScheduler.js';

dotenv.config();

// Ensure uploads folder exists for CSV imports
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/taxonomy', taxonomyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Food Redistribution Backend (MERN)',
    timestamp: new Date().toISOString()
  });
});

// Run Expiry Scan endpoint for manual trigger
app.post('/api/admin/scan-expiry', async (req, res) => {
  const count = await runExpiryScan();
  res.json({ message: 'Expiry scan complete', updatedItems: count });
});

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    initExpiryCron();
  });
});
