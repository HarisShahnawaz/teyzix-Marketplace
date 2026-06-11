import express from 'express';
import { createRequest, getUserRequests, updateRequestStatus } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', createRequest);
router.get('/', getUserRequests);
router.put('/:id/status', updateRequestStatus);

export default router;