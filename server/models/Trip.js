const mongoose = require('mongoose');

const tripActivitySchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: [
      'sightseeing',
      'food',
      'adventure',
      'culture',
      'shopping',
      'nightlife',
      'nature',
      'entertainment',
    ],
    default: 'sightseeing',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  time: {
    type: String,
    default: '10:00',
  },
  duration: {
    type: Number,
    default: 2,
  },
  cost: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const stopExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['transport', 'stay', 'activities', 'meals', 'other'],
    default: 'other',
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const tripStopSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  cityName: {
    type: String,
    required: [true, 'City name is required for stop'],
  },
  country: {
    type: String,
    required: [true, 'Country name is required for stop'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  order: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  estimatedCost: {
    type: Number,
    default: 0,
  },
  activities: [tripActivitySchema],
  expenses: [stopExpenseSchema],
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      maxlength: [100, 'Trip name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Upcoming', 'Ongoing', 'Completed'],
      default: 'Draft',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    totalBudget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative'],
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    travelPersonality: {
      type: String,
      enum: [
        'Adventure',
        'Relaxed',
        'Luxury',
        'Budget',
        'Foodie',
        'Nature',
        'Culture',
        'Photography',
        'Family',
        'Backpacker',
      ],
      default: 'Adventure',
    },
    planBActivities: [
      {
        primaryActivityName: String,
        planBName: String,
        planBCategory: String,
        planBCost: Number,
        notes: String,
      },
    ],
    journalEntries: [
      {
        photoUrl: String,
        note: String,
        location: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    collaborators: [
      {
        email: String,
        role: { type: String, enum: ['Editor', 'Viewer'], default: 'Editor' },
        status: { type: String, enum: ['Pending', 'Accepted'], default: 'Accepted' },
      },
    ],
    copiedCount: {
      type: Number,
      default: 0,
    },
    stops: [tripStopSchema],
  },
  {
    timestamps: true,
  }
);

// Helper method to automatically calculate status and estimatedCost
tripSchema.methods.recalculate = function () {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  // Status calculation
  if (this.stops.length === 0) {
    this.status = 'Draft';
  } else if (now < start) {
    this.status = 'Upcoming';
  } else if (now >= start && now <= end) {
    this.status = 'Ongoing';
  } else {
    this.status = 'Completed';
  }

  // Cost calculation
  let totalCost = 0;
  this.stops.forEach((stop) => {
    let stopCost = 0;
    if (stop.activities && stop.activities.length > 0) {
      stop.activities.forEach((act) => {
        stopCost += Number(act.cost || 0);
      });
    }
    if (stop.expenses && stop.expenses.length > 0) {
      stop.expenses.forEach((exp) => {
        stopCost += Number(exp.amount || 0);
      });
    }
    stop.estimatedCost = stopCost;
    totalCost += stopCost;
  });

  this.estimatedCost = totalCost;
};

module.exports = mongoose.model('Trip', tripSchema);
