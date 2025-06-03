import { AppDataSource } from './data-source';

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Run migrations in production
    if (process.env.NODE_ENV === 'production') {
      await AppDataSource.runMigrations();
      console.log('Migrations have been executed');
    }

    return AppDataSource;
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};

// Graceful shutdown handler
export const closeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Data Source has been closed.');
    }
  } catch (error) {
    console.error('Error during Data Source shutdown:', error);
    throw error;
  }
}; 