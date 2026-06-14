import express from 'express';
import { getServices, createService } from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import multer from 'multer';

const router = express.Router();

router.get('/', getServices);

// 🟩 Middleware wrapper to safely catch Multer limits/errors before calling the controller
const handleServiceUpload = (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: "The uploaded banner file is too large. Please select an image under 10MB." 
        });
      }
      return res.status(400).json({ error: `Upload validation error: ${err.message}` });
    } else if (err) {
      // Handles custom errors thrown by your fileFilter setup
      return res.status(400).json({ error: err.message });
    }
    
    // Everything passed successfully, proceed to createService controller logic
    next();
  });
};

// Apply the custom upload handling middleware seamlessly into the creation pipeline
router.post(
  '/', 
  protect, 
  authorizeRoles('provider', 'agency'), 
  handleServiceUpload, 
  createService
);

export default router;