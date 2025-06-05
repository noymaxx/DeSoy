import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './config/database/data-source';
import userRoutes from './routes/user.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3001'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.use('/api/v1/users', userRoutes);

// --- Database Connection & Server Start ---
AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL Data Source has been initialized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`User API available at http://localhost:${PORT}/api/v1/users`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });

export default app;
