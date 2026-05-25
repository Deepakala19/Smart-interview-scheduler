const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserProfile, 
  updateUserStatus,
  updateUserRound 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// HR can get list of all users
router.get('/', protect, authorize('admin', 'hr'), getUsers);
router.get('/:id', protect, getUserProfile);
router.put('/:id/status', protect, authorize('admin', 'hr'), updateUserStatus);
router.put('/:id/round', protect, authorize('admin', 'hr'), updateUserRound);

module.exports = router;
