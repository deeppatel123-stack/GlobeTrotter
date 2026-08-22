const express = require('express');
const {
  updateProfile,
  toggleSavedDestination,
  getSavedDestinations,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.get('/saved-destinations', getSavedDestinations);
router.post('/saved-destinations/:cityId', toggleSavedDestination);
router.delete('/account', deleteAccount);

module.exports = router;
