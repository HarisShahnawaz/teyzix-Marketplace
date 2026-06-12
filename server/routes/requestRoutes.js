import express from 'express';
import { createRequest, getUserRequests } from '../controllers/requestController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, authorizeRoles('customer'), createRequest);


router.get('/my-requests', protect, getUserRequests);

export default router;