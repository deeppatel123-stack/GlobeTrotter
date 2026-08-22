import api from './api';

export const publicService = {
  getPublicTripBySlug: async (slug) => {
    const response = await api.get(`/public/trips/${slug}`);
    return response.data;
  },

  copyPublicTrip: async (slug) => {
    const response = await api.post(`/public/trips/${slug}/copy`);
    return response.data;
  },
};
