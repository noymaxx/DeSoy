import { Router } from 'express';
import { API_VERSION } from '../config/constants';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: API_VERSION });
});

// TODO: Add other route modules here
// router.use('/users', userRoutes);
// router.use('/assets', assetRoutes);
// router.use('/investments', investmentRoutes);

export default router; 