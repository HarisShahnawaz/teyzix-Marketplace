import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.get('/stats', protect, getAdminStats);

export default router;
