import apiClient from './apiClient';

const performanceService = {
  getMyPerformances: async () => {
    const response = await apiClient.get('/api/my-performances');
    return response.data.performances;
  },
};

export default performanceService;
