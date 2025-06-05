import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController(); // Instantiated here

// POST /api/v1/users/wallet - For frontend to register/find user by wallet address
router.post('/wallet', userController.handleUserWallet);

// GET /api/v1/users - To fetch all users
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:walletAddress - To fetch a specific user by their wallet address
router.get('/:walletAddress', userController.getUser);

// PUT /api/v1/users/:walletAddress - To update a specific user
// The request body should contain fields to update, e.g., { "civicUserId": "some-id" }
router.put('/:walletAddress', userController.updateUser);

// DELETE /api/v1/users/:walletAddress - To delete a specific user
router.delete('/:walletAddress', userController.deleteUser);

export default router; 