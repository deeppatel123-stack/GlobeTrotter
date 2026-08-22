const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
      index: true,
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'],
      default: 'Asia',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    popularity: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
      index: true,
    },
    costIndex: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
      index: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    recommended: {
      type: Boolean,
      default: false,
      index: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

citySchema.index({ name: 'text', country: 'text', description: 'text' });

module.exports = mongoose.model('City', citySchema);
