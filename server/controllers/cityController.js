const City = require('../models/City');
const Activity = require('../models/Activity');

// @desc    Get all cities with filters, search, and pagination
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const { search, region, country, costIndex, minPopularity, recommended, sort, limit = 50, page = 1 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (region && region !== 'all') {
      query.region = region;
    }

    if (country && country !== 'all') {
      query.country = { $regex: `^${country}$`, $options: 'i' };
    }

    if (costIndex && costIndex !== 'all') {
      query.costIndex = Number(costIndex);
    }

    if (minPopularity) {
      query.popularity = { $gte: Number(minPopularity) };
    }

    if (recommended === 'true') {
      query.recommended = true;
    }

    let sortQuery = { popularity: -1 };
    if (sort === 'cost-asc') sortQuery = { costIndex: 1, popularity: -1 };
    if (sort === 'cost-desc') sortQuery = { costIndex: -1, popularity: -1 };
    if (sort === 'name-asc') sortQuery = { name: 1 };
    if (sort === 'name-desc') sortQuery = { name: -1 };
    if (sort === 'popularity') sortQuery = { popularity: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await City.countDocuments(query);
    const cities = await City.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single city by ID with activities
// @route   GET /api/cities/:id
// @access  Public
const getCityById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
        data: null,
      });
    }

    const activities = await Activity.find({ city: city._id }).sort({ popularity: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...city.toObject(),
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended and popular cities for dashboard
// @route   GET /api/cities/recommended
// @access  Public
const getRecommendedCities = async (req, res, next) => {
  try {
    const recommended = await City.find({ recommended: true }).limit(6);
    const popular = await City.find().sort({ popularity: -1 }).limit(6);

    res.status(200).json({
      success: true,
      data: {
        recommended,
        popular,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter metadata (distinct countries, regions)
// @route   GET /api/cities/filters
// @access  Public
const getFilterOptions = async (req, res, next) => {
  try {
    const regions = await City.distinct('region');
    const countries = await City.distinct('country');

    res.status(200).json({
      success: true,
      data: {
        regions: regions.sort(),
        countries: countries.sort(),
        costIndices: [1, 2, 3, 4, 5],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCities,
  getCityById,
  getRecommendedCities,
  getFilterOptions,
};
