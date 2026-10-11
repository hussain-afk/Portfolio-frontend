const API_URL = ' https://portfolio-backend-2-1i51.onrender.com/admin';
import axios from 'axios';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw error(error.response?.data?.message || 'Login failed');
    }
}

export const addProject = async (projectData) => {
    try {
        const response = await api.post('/add-project', projectData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add project');
    }
}

export const addCertificate = async (certificateData) => {
    try {
        const response = await api.post('/add-certificate', certificateData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add certificate');
    }
}

export const sendMessage = async (messageData) => {
    try {
        const response = await api.post('/message', messageData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
    }
}

export const getMessages = async () => {
    try {
        const response = await api.get('/all-messages');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
}

export const getProjects = async () => {
    try {
        const response = await api.get('/projects');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
}

export const getCertificates = async () => {
    try {
        const response = await api.get('/certificates');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch certificates');
    }
}