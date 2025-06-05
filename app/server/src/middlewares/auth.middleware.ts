import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errorHandler';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../config/database/data-source';

// Mock user for development
const MOCK_USER = {
  id: "mock-user-id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  walletAddress: "0x123...789",
  role: "PRODUCER"
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Attach mock user to request
  req.body.walletAddress = MOCK_USER as any;
  next();
}; 