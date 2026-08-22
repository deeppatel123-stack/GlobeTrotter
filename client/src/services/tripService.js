import api from './api';

export const tripService = {
  getTrips: async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data;
  },

  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  updateTrip: async (id, tripData) => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  duplicateTrip: async (id) => {
    const response = await api.post(`/trips/${id}/duplicate`);
    return response.data;
  },

  // Stop operations
  addStop: async (tripId, stopData) => {
    const response = await api.post(`/trips/${tripId}/stops`, stopData);
    return response.data;
  },

  updateStop: async (tripId, stopId, stopData) => {
    const response = await api.put(`/trips/${tripId}/stops/${stopId}`, stopData);
    return response.data;
  },

  deleteStop: async (tripId, stopId) => {
    const response = await api.delete(`/trips/${tripId}/stops/${stopId}`);
    return response.data;
  },

  reorderStops: async (tripId, orderedStopIds) => {
    const response = await api.put(`/trips/${tripId}/stops/reorder`, { orderedStopIds });
    return response.data;
  },

  // Activity operations
  addActivityToStop: async (tripId, stopId, activityData) => {
    const response = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
    return response.data;
  },

  updateActivityInStop: async (tripId, stopId, activityId, activityData) => {
    const response = await api.put(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, activityData);
    return response.data;
  },

  removeActivityFromStop: async (tripId, stopId, activityId) => {
    const response = await api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
    return response.data;
  },

  // Expense operations
  addExpenseToStop: async (tripId, stopId, expenseData) => {
    const response = await api.post(`/trips/${tripId}/stops/${stopId}/expenses`, expenseData);
    return response.data;
  },

  deleteExpenseFromStop: async (tripId, stopId, expenseId) => {
    const response = await api.delete(`/trips/${tripId}/stops/${stopId}/expenses/${expenseId}`);
    return response.data;
  },

  // Budget & Sharing & KPI
  getTripBudget: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/budget`);
    return response.data;
  },

  toggleShareTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/share`);
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get('/trips/dashboard/summary');
    return response.data;
  },
};
