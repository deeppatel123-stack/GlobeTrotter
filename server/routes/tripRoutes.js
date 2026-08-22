const express = require('express');
const { body } = require('express-validator');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
  addActivityToStop,
  updateActivityInStop,
  removeActivityFromStop,
  addExpenseToStop,
  deleteExpenseFromStop,
  getTripBudget,
  toggleShareTrip,
  getDashboardSummary,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router.get('/dashboard/summary', getDashboardSummary);

router
  .route('/')
  .post(
    [
      body('name').trim().notEmpty().withMessage('Trip name is required'),
      body('startDate').notEmpty().withMessage('Start date is required'),
      body('endDate').notEmpty().withMessage('End date is required'),
    ],
    validate,
    createTrip
  )
  .get(getTrips);

router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

router.post('/:id/duplicate', duplicateTrip);
router.post('/:id/share', toggleShareTrip);
router.get('/:id/budget', getTripBudget);

// Stops
router.post('/:id/stops', addStop);
router.put('/:id/stops/reorder', reorderStops);
router.route('/:id/stops/:stopId').put(updateStop).delete(deleteStop);

// Activities in Stops
router.post('/:id/stops/:stopId/activities', addActivityToStop);
router
  .route('/:id/stops/:stopId/activities/:activityId')
  .put(updateActivityInStop)
  .delete(removeActivityFromStop);

// Expenses in Stops
router.post('/:id/stops/:stopId/expenses', addExpenseToStop);
router.delete('/:id/stops/:stopId/expenses/:expenseId', deleteExpenseFromStop);

module.exports = router;
