const Trip = require('../models/Trip');

const recalculateAndSaveTrip = async (trip) => {
  trip.recalculate();
  return await trip.save();
};

module.exports = {
  recalculateAndSaveTrip,
};
