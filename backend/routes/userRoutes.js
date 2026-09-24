import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAdminStats,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/admin/stats', protect, admin, getAdminStats);

export default router;
