import api from './api';

export const activityService = {
  getActivities: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  getActivityById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/activities/categories');
    return response.data;
  },
};
