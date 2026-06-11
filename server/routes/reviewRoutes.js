import express from 'express';
import { createReview, getServiceReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/service/:serviceId', getServiceReviews);

export default router;