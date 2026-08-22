const express = require('express');
const {
  getActivities,
  getActivityById,
  getCategories,
} = require('../controllers/activityController');

const router = express.Router();

router.get('/', getActivities);
router.get('/categories', getCategories);
router.get('/:id', getActivityById);

module.exports = router;
