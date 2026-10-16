import axios from 'axios';

// const defaultApiUrl = import.meta.env.DEV
//   ? "http://localhost:4000"
//   : "https://portfolio-backend-2-1i51.onrender.com";
const API_URL = "https://portfolio-backend-2-1i51.onrender.com/admin";

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

export const getSession = async () => {
  try {
    const response = await api.get('/session');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Session check failed');
  }
};

export const getHero = async () => {
  try {
    const response = await api.get('/hero');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch hero settings');
  }
};

export const updateHero = async (heroData) => {
  try {
    const response = await api.put('/hero', heroData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to update hero settings');
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