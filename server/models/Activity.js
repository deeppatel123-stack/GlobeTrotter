const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
      index: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    duration: {
      type: Number, // in hours (e.g. 2.5 = 2h 30m)
      default: 2,
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 1.0,
      max: 5.0,
      default: 4.5,
    },
    popularity: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
    },
    location: {
      type: String,
      default: '',
    },
    recommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Activity', activitySchema);
