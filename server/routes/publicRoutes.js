const express = require('express');
const {
  getPublicTripBySlug,
  copyPublicTrip,
} = require('../controllers/publicTripController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public read-only trip view
router.get('/trips/:slug', getPublicTripBySlug);

// Copy public trip to authenticated user's account
router.post('/trips/:slug/copy', protect, copyPublicTrip);

module.exports = router;
