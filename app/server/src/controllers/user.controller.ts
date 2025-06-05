import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../entities/User.entity'; // Import User entity if needed for request body typing

// Instantiated at the module level, assuming singleton for simplicity
// In a more complex setup, dependency injection would be used.
const userService = new UserService(); 

export class UserController {
  async handleUserWallet(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.body;

    if (!walletAddress || typeof walletAddress !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({ message: 'Valid walletAddress (string, 0x prefixed, 40 hex chars) is required in the body.' });
      return;
    }

    try {
      const user = await userService.findOrCreateUserByWalletAddress(walletAddress);
      // Return only essential info, or tailor as needed
      res.status(200).json({ 
        message: 'User processed successfully', 
        walletAddress: user.walletAddress,
        createdAt: user.createdAt 
      });
    } catch (error: any) {
      console.error('Error in handleUserWallet:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.params;

     if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({ message: 'Valid walletAddress (0x prefixed, 40 hex chars) parameter is required.' });
      return;
    }

    try {
      const user = await userService.getUserByWalletAddress(walletAddress);
      if (user) {
        res.status(200).json(user); // Send the full user object or tailor as needed
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      console.error('Error in getUser:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.params;
    // For update, we expect other fields in the body. Example: { civicUserId: "..." }
    // The service method is typed to accept Partial<Omit<User, 'walletAddress' | 'createdAt' | 'updatedAt'>>
    const updateData: Partial<Omit<User, 'walletAddress' | 'createdAt' | 'updatedAt'>> = req.body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({ message: 'Valid walletAddress parameter is required.' });
      return;
    }
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'Request body must contain data to update.' });
      return;
    }

    try {
      const updatedUser = await userService.updateUserByWalletAddress(walletAddress, updateData);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found for update' });
      }
    } catch (error: any) {
      console.error('Error in updateUser:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { walletAddress } = req.params;
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({ message: 'Valid walletAddress parameter is required.' });
      return;
    }
    try {
      const success = await userService.deleteUserByWalletAddress(walletAddress);
      if (success) {
        res.status(200).json({ message: 'User deleted successfully' }); // Or res.status(204).send(); for No Content
      } else {
        res.status(404).json({ message: 'User not found for deletion' });
      }
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
} 