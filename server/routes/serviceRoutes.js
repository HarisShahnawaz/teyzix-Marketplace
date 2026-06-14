import express from 'express';
import { getServices, createService } from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get('/', getServices);

router.post('/', protect, authorizeRoles('provider', 'agency'), upload.single('image'), createService);

export default router;