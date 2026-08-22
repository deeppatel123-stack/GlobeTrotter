const express = require('express');
const {
  getCities,
  getCityById,
  getRecommendedCities,
  getFilterOptions,
} = require('../controllers/cityController');

const router = express.Router();

router.get('/', getCities);
router.get('/recommended', getRecommendedCities);
router.get('/filters', getFilterOptions);
router.get('/:id', getCityById);

module.exports = router;
