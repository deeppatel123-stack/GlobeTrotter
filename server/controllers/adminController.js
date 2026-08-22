const User = require('../models/User');
const Trip = require('../models/Trip');
const City = require('../models/City');
const Activity = require('../models/Activity');

// @desc    Get admin KPI metrics, analytics, and platform usage stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalTrips = await Trip.countDocuments();
    const publicTrips = await Trip.countDocuments({ isPublic: true });
    const totalCities = await City.countDocuments();
    const totalActivities = await Activity.countDocuments();

    // Trip status breakdown
    const trips = await Trip.find().select('name status estimatedCost totalBudget createdAt stops isPublic user').populate('user', 'name email');

    let totalEstimatedSpending = 0;
    const statusCounts = { Draft: 0, Upcoming: 0, Ongoing: 0, Completed: 0 };
    const cityFrequency = {};
    const monthlyStats = {};

    trips.forEach((trip) => {
      totalEstimatedSpending += Number(trip.estimatedCost || 0);
      if (statusCounts[trip.status] !== undefined) {
        statusCounts[trip.status]++;
      }

      if (trip.stops && Array.isArray(trip.stops)) {
        trip.stops.forEach((stop) => {
          const cName = stop.cityName || 'Unknown';
          cityFrequency[cName] = (cityFrequency[cName] || 0) + 1;
        });
      }

      // Group by Month (e.g. "Jan 2026", "Feb 2026")
      const monthYear = new Date(trip.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      monthlyStats[monthYear] = (monthlyStats[monthYear] || 0) + 1;
    });

    // Top 5 destinations
    const topCities = Object.keys(cityFrequency)
      .map((city) => ({ name: city, count: cityFrequency[city] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top activities by popularity
    const topActivities = await Activity.find()
      .populate('city', 'name country')
      .sort({ popularity: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 trips
    const recentTrips = await Trip.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly trends formatted for Recharts
    const trendData = Object.keys(monthlyStats).map((month) => ({
      month,
      trips: monthlyStats[month],
    }));

    if (trendData.length === 0) {
      trendData.push({ month: 'Aug 2026', trips: totalTrips });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeUsers,
          totalTrips,
          publicTrips,
          totalCities,
          totalActivities,
          totalEstimatedSpending,
          averageCostPerTrip: totalTrips > 0 ? Math.round(totalEstimatedSpending / totalTrips) : 0,
        },
        statusDistribution: [
          { name: 'Upcoming', value: statusCounts.Upcoming, color: '#3b82f6' },
          { name: 'Ongoing', value: statusCounts.Ongoing, color: '#10b981' },
          { name: 'Draft', value: statusCounts.Draft, color: '#f59e0b' },
          { name: 'Completed', value: statusCounts.Completed, color: '#6b7280' },
        ],
        topCities,
        topActivities,
        recentUsers,
        recentTrips,
        trends: trendData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filter
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/deactivated status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }

    // Prevent self-deactivation of current admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own administrator account',
        data: null,
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Deactivated'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user/admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
        data: null,
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getUsers,
  toggleUserStatus,
  updateUserRole,
};
