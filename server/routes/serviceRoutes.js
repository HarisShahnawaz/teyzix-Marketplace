import express from 'express';
import { getServices, createService } from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getServices);

router.post('/', protect, authorizeRoles('provider', 'agency'), createService);

export default router;