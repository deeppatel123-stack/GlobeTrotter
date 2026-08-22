const { calculateBudgetBreakdown } = require('../utils/budgetEngine');

const getBudgetAnalysis = (trip) => {
  return calculateBudgetBreakdown(trip);
};

module.exports = {
  getBudgetAnalysis,
};
