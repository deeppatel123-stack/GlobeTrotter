const Trip = require('../models/Trip');
const City = require('../models/City');
const Activity = require('../models/Activity');
const { generateSlug } = require('../utils/slug');
const { calculateBudgetBreakdown } = require('../utils/budgetEngine');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const {
      name,
      startDate,
      endDate,
      description,
      coverPhoto,
      currency,
      totalBudget,
      isPublic,
    } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Trip name, start date, and end date are required',
        data: null,
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date',
        data: null,
      });
    }

    const trip = new Trip({
      user: req.user._id,
      name,
      startDate,
      endDate,
      description: description || '',
      coverPhoto:
        coverPhoto ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      currency: currency || 'INR',
      totalBudget: Number(totalBudget) || 0,
      isPublic: isPublic || false,
      publicSlug: isPublic ? generateSlug(name) : undefined,
      stops: [],
    });

    trip.recalculate();
    await trip.save();

    res.status(201).json({
      success: true,
      message: 'Trip created successfully!',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for current user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'startDate') sortOption = { startDate: 1 };
    if (sort === 'budget-high') sortOption = { totalBudget: -1 };
    if (sort === 'budget-low') sortOption = { totalBudget: 1 };

    const trips = await Trip.find(query)
      .populate('stops.city')
      .sort(sortOption);

    // Ensure status is updated
    for (const trip of trips) {
      const prevStatus = trip.status;
      trip.recalculate();
      if (trip.status !== prevStatus) {
        await trip.save();
      }
    }

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('stops.city')
      .populate('stops.activities.activity');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have permission to view it',
        data: null,
      });
    }

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip details
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const {
      name,
      description,
      coverPhoto,
      startDate,
      endDate,
      totalBudget,
      currency,
      isPublic,
    } = req.body;

    if (name) trip.name = name;
    if (description !== undefined) trip.description = description;
    if (coverPhoto) trip.coverPhoto = coverPhoto;
    if (startDate) trip.startDate = startDate;
    if (endDate) trip.endDate = endDate;
    if (totalBudget !== undefined) trip.totalBudget = Number(totalBudget);
    if (currency) trip.currency = currency;

    if (isPublic !== undefined) {
      trip.isPublic = isPublic;
      if (isPublic && !trip.publicSlug) {
        trip.publicSlug = generateSlug(trip.name);
      }
    }

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate an existing trip
// @route   POST /api/trips/:id/duplicate
// @access  Private
const duplicateTrip = async (req, res, next) => {
  try {
    const originalTrip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!originalTrip) {
      return res.status(404).json({
        success: false,
        message: 'Original trip not found',
        data: null,
      });
    }

    const clonedTripData = originalTrip.toObject();
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

    clonedTripData.name = `Copy of ${originalTrip.name}`;
    clonedTripData.isPublic = false;
    clonedTripData.status = 'Draft';

    const newTrip = new Trip(clonedTripData);
    newTrip.recalculate();
    await newTrip.save();

    res.status(201).json({
      success: true,
      message: 'Trip duplicated successfully!',
      data: newTrip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a stop to trip
// @route   POST /api/trips/:id/stops
// @access  Private
const addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const { cityId, cityName, country, image, startDate, endDate, notes } = req.body;

    let resolvedCityName = cityName;
    let resolvedCountry = country;
    let resolvedImage = image;

    if (cityId) {
      const city = await City.findById(cityId);
      if (city) {
        resolvedCityName = resolvedCityName || city.name;
        resolvedCountry = resolvedCountry || city.country;
        resolvedImage = resolvedImage || city.image;
      }
    }

    const newStop = {
      city: cityId || undefined,
      cityName: resolvedCityName || 'New Destination',
      country: resolvedCountry || 'Global',
      image:
        resolvedImage ||
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
      startDate: startDate || trip.startDate,
      endDate: endDate || trip.endDate,
      order: trip.stops.length,
      notes: notes || '',
      activities: [],
      expenses: [],
      estimatedCost: 0,
    };

    trip.stops.push(newStop);
    trip.recalculate();
    await trip.save();

    const updatedTrip = await Trip.findById(trip._id)
      .populate('stops.city')
      .populate('stops.activities.activity');

    res.status(201).json({
      success: true,
      message: `Added ${newStop.cityName} to trip!`,
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a stop
// @route   PUT /api/trips/:id/stops/:stopId
// @access  Private
const updateStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found',
        data: null,
      });
    }

    const { cityName, country, startDate, endDate, notes, image } = req.body;

    if (cityName) stop.cityName = cityName;
    if (country) stop.country = country;
    if (startDate) stop.startDate = startDate;
    if (endDate) stop.endDate = endDate;
    if (notes !== undefined) stop.notes = notes;
    if (image) stop.image = image;

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Stop updated successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a stop
// @route   DELETE /api/trips/:id/stops/:stopId
// @access  Private
const deleteStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    trip.stops = trip.stops.filter(
      (s) => s._id.toString() !== req.params.stopId.toString()
    );

    // Re-index stop order
    trip.stops.forEach((s, idx) => {
      s.order = idx;
    });

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Stop removed from itinerary',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder stops
// @route   PUT /api/trips/:id/stops/reorder
// @access  Private
const reorderStops = async (req, res, next) => {
  try {
    const { orderedStopIds } = req.body; // Array of stop IDs in new order

    if (!Array.isArray(orderedStopIds)) {
      return res.status(400).json({
        success: false,
        message: 'orderedStopIds array is required',
        data: null,
      });
    }

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stopMap = {};
    trip.stops.forEach((stop) => {
      stopMap[stop._id.toString()] = stop;
    });

    const reordered = [];
    orderedStopIds.forEach((id, index) => {
      if (stopMap[id]) {
        const s = stopMap[id];
        s.order = index;
        reordered.push(s);
      }
    });

    trip.stops = reordered;
    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Itinerary stops reordered successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity to a stop
// @route   POST /api/trips/:id/stops/:stopId/activities
// @access  Private
const addActivityToStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found in this trip',
        data: null,
      });
    }

    const {
      activityId,
      name,
      description,
      category,
      image,
      time,
      duration,
      cost,
      notes,
      date,
    } = req.body;

    let actDetails = {
      name,
      description,
      category,
      image,
      duration,
      cost,
    };

    if (activityId) {
      const catalogAct = await Activity.findById(activityId);
      if (catalogAct) {
        actDetails.activity = catalogAct._id;
        actDetails.name = name || catalogAct.name;
        actDetails.description = description || catalogAct.description;
        actDetails.category = category || catalogAct.category;
        actDetails.image = image || catalogAct.image;
        actDetails.duration = duration !== undefined ? Number(duration) : catalogAct.duration;
        actDetails.cost = cost !== undefined ? Number(cost) : catalogAct.estimatedCost;
      }
    }

    const newActivity = {
      activity: actDetails.activity,
      name: actDetails.name || 'Untitled Activity',
      description: actDetails.description || '',
      category: actDetails.category || 'sightseeing',
      image:
        actDetails.image ||
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      time: time || '10:00',
      duration: Number(actDetails.duration || 2),
      cost: Number(actDetails.cost || 0),
      notes: notes || '',
      date: date || stop.startDate || trip.startDate,
      completed: false,
    };

    stop.activities.push(newActivity);
    trip.recalculate();
    await trip.save();

    const updatedTrip = await Trip.findById(trip._id)
      .populate('stops.city')
      .populate('stops.activities.activity');

    res.status(201).json({
      success: true,
      message: `Activity "${newActivity.name}" added to stop!`,
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update activity in a stop
// @route   PUT /api/trips/:id/stops/:stopId/activities/:activityId
// @access  Private
const updateActivityInStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found',
        data: null,
      });
    }

    const activity = stop.activities.id(req.params.activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found in this stop',
        data: null,
      });
    }

    const { name, time, duration, cost, notes, date, completed, category } = req.body;

    if (name) activity.name = name;
    if (time) activity.time = time;
    if (duration !== undefined) activity.duration = Number(duration);
    if (cost !== undefined) activity.cost = Number(cost);
    if (notes !== undefined) activity.notes = notes;
    if (date) activity.date = date;
    if (completed !== undefined) activity.completed = Boolean(completed);
    if (category) activity.category = category;

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete activity from a stop
// @route   DELETE /api/trips/:id/stops/:stopId/activities/:activityId
// @access  Private
const removeActivityFromStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found',
        data: null,
      });
    }

    stop.activities = stop.activities.filter(
      (a) => a._id.toString() !== req.params.activityId.toString()
    );

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Activity removed from stop',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add expense to a stop
// @route   POST /api/trips/:id/stops/:stopId/expenses
// @access  Private
const addExpenseToStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found',
        data: null,
      });
    }

    const { category, description, amount, currency, date } = req.body;

    if (!description || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Description and amount are required for expense',
        data: null,
      });
    }

    const newExpense = {
      category: category || 'other',
      description,
      amount: Number(amount),
      currency: currency || trip.currency || 'INR',
      date: date || new Date(),
    };

    stop.expenses.push(newExpense);
    trip.recalculate();
    await trip.save();

    res.status(201).json({
      success: true,
      message: 'Expense added to stop budget',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense from a stop
// @route   DELETE /api/trips/:id/stops/:stopId/expenses/:expenseId
// @access  Private
const deleteExpenseFromStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Stop not found',
        data: null,
      });
    }

    stop.expenses = stop.expenses.filter(
      (e) => e._id.toString() !== req.params.expenseId.toString()
    );

    trip.recalculate();
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Expense removed',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trip budget breakdown and analytics
// @route   GET /api/trips/:id/budget
// @access  Private
const getTripBudget = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    const breakdown = calculateBudgetBreakdown(trip);

    res.status(200).json({
      success: true,
      data: {
        tripId: trip._id,
        tripName: trip.name,
        currency: trip.currency,
        ...breakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle trip sharing / public URL
// @route   POST /api/trips/:id/share
// @access  Private
const toggleShareTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null,
      });
    }

    trip.isPublic = !trip.isPublic;
    if (trip.isPublic && !trip.publicSlug) {
      trip.publicSlug = generateSlug(trip.name);
    }

    await trip.save();

    res.status(200).json({
      success: true,
      message: trip.isPublic
        ? 'Trip is now public and sharable!'
        : 'Trip is now private.',
      data: {
        isPublic: trip.isPublic,
        publicSlug: trip.publicSlug,
        publicUrl: trip.isPublic ? `/public/trip/${trip.publicSlug}` : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/trips/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .populate('stops.city')
      .sort({ createdAt: -1 });

    const totalTrips = trips.length;
    let upcomingTripsCount = 0;
    let completedTripsCount = 0;
    let ongoingTripsCount = 0;
    let totalDestinationsCount = 0;
    let totalEstimatedSpending = 0;
    let totalBudgetSum = 0;

    trips.forEach((trip) => {
      trip.recalculate();
      if (trip.status === 'Upcoming') upcomingTripsCount++;
      if (trip.status === 'Completed') completedTripsCount++;
      if (trip.status === 'Ongoing') ongoingTripsCount++;

      totalDestinationsCount += trip.stops ? trip.stops.length : 0;
      totalEstimatedSpending += Number(trip.estimatedCost || 0);
      totalBudgetSum += Number(trip.totalBudget || 0);
    });

    const recentTrips = trips.slice(0, 4);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalTrips,
          upcomingTrips: upcomingTripsCount,
          ongoingTrips: ongoingTripsCount,
          completedTrips: completedTripsCount,
          totalDestinations: totalDestinationsCount,
          totalEstimatedSpending,
          totalBudget: totalBudgetSum,
          averageTripCost: totalTrips > 0 ? Math.round(totalEstimatedSpending / totalTrips) : 0,
        },
        recentTrips,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
