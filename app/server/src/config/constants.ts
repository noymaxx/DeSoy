import dotenv from 'dotenv';
dotenv.config();

// Server
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SERVER_PORT = process.env.PORT || 3001;

// Database
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '5432');
export const DB_USERNAME = process.env.DB_USERNAME || 'delasoja';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'delasoja';
export const DB_NAME = process.env.DB_NAME || 'delasoja';

// API Config
export const API_PREFIX = '/api';
export const API_VERSION = 'v1'; 