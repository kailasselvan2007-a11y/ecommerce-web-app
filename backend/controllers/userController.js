import { dbManager } from '../services/dbManager.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await dbManager.findUserById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('[UserController.getUserProfile] Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await dbManager.findUserByIdWithPassword(req.user._id);

    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailTaken = await dbManager.findUserByEmail(email);
      if (emailTaken && emailTaken._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Email address is already in use' });
      }
    }

    const updated = await dbManager.updateUser(req.user._id, {
      name: name || existing.name,
      email: email || existing.email,
      password: password && password.trim().length >= 6 ? password : undefined,
    });

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('[UserController.updateUserProfile] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

// @desc    Get admin overview statistics
// @route   GET /api/users/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const stats = await dbManager.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('[UserController.getAdminStats] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch admin stats' });
  }
};
