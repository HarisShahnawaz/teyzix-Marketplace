import express from 'express';
import { createRequest, getUserRequests, updateRequestStatus } from '../controllers/requestController.js'; // 🚀 Added import here
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected: Place an order request
router.post('/', protect, authorizeRoles('customer'), createRequest);

// Protected: Get orders belonging to the logged-in user
router.get('/my-requests', protect, getUserRequests);

// 🚀 Added: Protected route to handle status updates (Accept/Reject/Complete)
router.put('/:id', protect, updateRequestStatus);

export default router;