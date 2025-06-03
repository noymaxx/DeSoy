import 'reflect-metadata';
import app from './config/app';
import { SERVER_PORT, NODE_ENV } from './config/constants';
import routes from './routes/index';
import { initializeDatabase } from './config/database/database.config';

console.log(`Environment: ${NODE_ENV}`);
console.log('Connecting to database...');

// Register API routes
app.use('/api', routes);

// Start the server
const startServer = async () => {
  try {
    // Initialize the database
    await initializeDatabase();
    
    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`API URL: http://localhost:${SERVER_PORT}/api`);
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the application
startServer();
