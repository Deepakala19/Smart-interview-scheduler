const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterview,
  assignAdmin,
  updateInterviewStatus,
  updateInterview,
  deleteInterview,
  syncInterview,
  syncAllInterviews
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All interview routes are protected
router.use(protect);

router.post('/bulk-sync', syncAllInterviews);

router.route('/')
  .get(getInterviews)
  .post(authorize('hr'), createInterview);

router.route('/:id')
  .get(getInterview)
  .put(authorize('hr'), updateInterview)
  .delete(authorize('hr'), deleteInterview);

// Specific actions
router.route('/:id/assign').put(authorize('hr'), assignAdmin);
router.route('/:id/status').put(updateInterviewStatus);
router.route('/:id/sync').post(authorize('hr', 'admin'), syncInterview);

module.exports = router;
