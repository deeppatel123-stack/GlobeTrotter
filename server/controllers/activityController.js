const Activity = require('../models/Activity');
const City = require('../models/City');

// @desc    Get all activities with search, filter, and pagination
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res, next) => {
  try {
    const {
      search,
      category,
      cityId,
      minRating,
      maxCost,
      maxDuration,
      recommended,
      sort,
      limit = 50,
      page = 1,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (cityId && cityId !== 'all') {
      query.city = cityId;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxCost) {
      query.estimatedCost = { $lte: Number(maxCost) };
    }

    if (maxDuration) {
      query.duration = { $lte: Number(maxDuration) };
    }

    if (recommended === 'true') {
      query.recommended = true;
    }

    let sortQuery = { popularity: -1 };
    if (sort === 'cost-asc') sortQuery = { estimatedCost: 1 };
    if (sort === 'cost-desc') sortQuery = { estimatedCost: -1 };
    if (sort === 'rating-desc') sortQuery = { rating: -1 };
    if (sort === 'duration-asc') sortQuery = { duration: 1 };
    if (sort === 'name-asc') sortQuery = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate('city', 'name country image')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('city');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct activity categories
// @route   GET /api/activities/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { id: 'all', label: 'All Categories' },
      { id: 'sightseeing', label: 'Sightseeing' },
      { id: 'food', label: 'Food & Dining' },
      { id: 'adventure', label: 'Adventure & Outdoor' },
      { id: 'culture', label: 'Culture & Heritage' },
      { id: 'shopping', label: 'Shopping' },
      { id: 'nightlife', label: 'Nightlife' },
      { id: 'nature', label: 'Nature & Parks' },
      { id: 'entertainment', label: 'Entertainment' },
    ];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  getActivityById,
  getCategories,
};
