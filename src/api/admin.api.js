import axios from 'axios';

const API_URL = "https://portfolio-backend-2-1i51.onrender.com/admin"; // Replace with your backend API URL
  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

const getApiError = (error, fallback) => {
  const normalized = new Error(error?.response?.data?.message || error?.message || fallback);
  normalized.status = error?.response?.status;
  return normalized;
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Login failed');
  }
};

export const addProject = async (projectData) => {
  try {
    const response = await api.post('/add-project', projectData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to add project');
  }
};

export const addInWorkingProject = async (projectData) => {
  try {
    const response = await api.post('/add-w-project', projectData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to add in working project');
  }
};

export const addCertificate = async (certificateData) => {
  try {
    const response = await api.post('/add-certificate', certificateData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to add certificate');
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/message', messageData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to send message');
  }
};

export const getMessages = async () => {
  try {
    const response = await api.get('/all-messages');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch messages');
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch projects');
  }
};

export const getCertificates = async () => {
  try {
    const response = await api.get('/certificates');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch certificates');
  }
};

export const getInWorkingProjects = async () => {
  try {
    const response = await api.get('/in-working-projects');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch in working projects');
  }
};