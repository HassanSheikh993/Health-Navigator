import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Helper function to handle axios requests
export const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error.response) {
     
      return error.response.data;
    }
    throw error;
  }
};

export default api;