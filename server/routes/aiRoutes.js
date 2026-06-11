import express from 'express';
import { handleAIChat } from '../controllers/aiController.js';

const router = express.Router();

router.post('/', handleAIChat);

export default router;