const Trip = require('../models/Trip');
const { calculateBudgetBreakdown } = require('../utils/budgetEngine');

// @desc    Get public itinerary by unique slug (Read-only)
// @route   GET /api/public/trips/:slug
// @access  Public
const getPublicTripBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const trip = await Trip.findOne({
      publicSlug: slug,
      isPublic: true,
    })
      .populate('user', 'name profilePhoto')
      .populate('stops.city')
      .populate('stops.activities.activity');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Public trip not found or this trip has been set to private.',
        data: null,
      });
    }

    const budget = calculateBudgetBreakdown(trip);

    res.status(200).json({
      success: true,
      data: {
        ...trip.toObject(),
        budgetSummary: budget,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Copy a public trip to logged in user's account
// @route   POST /api/public/trips/:slug/copy
// @access  Private (User must be logged in to copy)
const copyPublicTrip = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const sourceTrip = await Trip.findOne({
      publicSlug: slug,
      isPublic: true,
    });

    if (!sourceTrip) {
      return res.status(404).json({
        success: false,
        message: 'Public trip not found or no longer available for copying.',
        data: null,
      });
    }

    const clonedTripData = sourceTrip.toObject();
    delete clonedTripData._id;
    delete clonedTripData.createdAt;
    delete clonedTripData.updatedAt;
    delete clonedTripData.publicSlug;

    // Reset subdocument IDs
    if (clonedTripData.stops) {
      clonedTripData.stops.forEach((stop) => {
        delete stop._id;
        if (stop.activities) {
          stop.activities.forEach((act) => delete act._id);
        }
        if (stop.expenses) {
          stop.expenses.forEach((exp) => delete exp._id);
        }
      });
    }

    clonedTripData.user = req.user._id;
    clonedTripData.name = `Copy of ${sourceTrip.name}`;
    clonedTripData.isPublic = false;
    clonedTripData.status = 'Draft';

    const newTrip = new Trip(clonedTripData);
    newTrip.recalculate();
    await newTrip.save();

    res.status(201).json({
      success: true,
      message: `Trip successfully copied to your account!`,
      data: newTrip,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicTripBySlug,
  copyPublicTrip,
};
