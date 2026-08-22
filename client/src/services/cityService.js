import api from './api';

export const cityService = {
  getCities: async (params = {}) => {
    const response = await api.get('/cities', { params });
    return response.data;
  },

  getCityById: async (id) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },

  getRecommendedCities: async () => {
    const response = await api.get('/cities/recommended');
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get('/cities/filters');
    return response.data;
  },
};
