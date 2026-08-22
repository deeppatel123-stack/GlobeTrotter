const calculateBudgetBreakdown = (trip) => {
  const categories = {
    transport: 0,
    stay: 0,
    activities: 0,
    meals: 0,
    other: 0,
  };

  const dailyCosts = {};

  // Calculate duration in days
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Traverse stops, activities, and stop expenses
  if (trip.stops && Array.isArray(trip.stops)) {
    trip.stops.forEach((stop) => {
      // Activities
      if (stop.activities && Array.isArray(stop.activities)) {
        stop.activities.forEach((act) => {
          const cost = Number(act.cost || 0);
          categories.activities += cost;

          const actDate = act.date
            ? new Date(act.date).toISOString().split('T')[0]
            : stop.startDate
            ? new Date(stop.startDate).toISOString().split('T')[0]
            : new Date(trip.startDate).toISOString().split('T')[0];

          dailyCosts[actDate] = (dailyCosts[actDate] || 0) + cost;
        });
      }

      // Stop Expenses
      if (stop.expenses && Array.isArray(stop.expenses)) {
        stop.expenses.forEach((exp) => {
          const amount = Number(exp.amount || 0);
          const cat = exp.category || 'other';
          if (categories[cat] !== undefined) {
            categories[cat] += amount;
          } else {
            categories.other += amount;
          }

          const expDate = exp.date
            ? new Date(exp.date).toISOString().split('T')[0]
            : stop.startDate
            ? new Date(stop.startDate).toISOString().split('T')[0]
            : new Date(trip.startDate).toISOString().split('T')[0];

          dailyCosts[expDate] = (dailyCosts[expDate] || 0) + amount;
        });
      }
    });
  }

  const totalCost = Object.values(categories).reduce((sum, val) => sum + val, 0);
  const totalBudget = Number(trip.totalBudget || 0);
  const remainingBudget = totalBudget - totalCost;
  const budgetPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalCost / totalBudget) * 100)) : 0;
  const isOverBudget = totalBudget > 0 && totalCost > totalBudget;
  const averageDailyCost = durationDays > 0 ? Math.round(totalCost / durationDays) : 0;
  const dailyBudgetLimit = totalBudget > 0 && durationDays > 0 ? Math.round(totalBudget / durationDays) : 0;

  // Find over-budget days if dailyBudgetLimit > 0
  const overBudgetDays = [];
  Object.keys(dailyCosts).forEach((dateKey) => {
    if (dailyBudgetLimit > 0 && dailyCosts[dateKey] > dailyBudgetLimit) {
      overBudgetDays.push({
        date: dateKey,
        cost: dailyCosts[dateKey],
        limit: dailyBudgetLimit,
        excess: dailyCosts[dateKey] - dailyBudgetLimit,
      });
    }
  });

  return {
    totalBudget,
    totalCost,
    remainingBudget,
    budgetPercentage,
    isOverBudget,
    durationDays,
    averageDailyCost,
    dailyBudgetLimit,
    categories,
    categoryChartData: [
      { name: 'Transport', value: categories.transport, color: '#3b82f6' },
      { name: 'Stay / Hotels', value: categories.stay, color: '#8b5cf6' },
      { name: 'Activities', value: categories.activities, color: '#10b981' },
      { name: 'Meals & Food', value: categories.meals, color: '#f59e0b' },
      { name: 'Other', value: categories.other, color: '#ec4899' },
    ].filter((item) => item.value > 0 || totalCost === 0),
    dailyCosts,
    overBudgetDays,
  };
};

module.exports = { calculateBudgetBreakdown };
