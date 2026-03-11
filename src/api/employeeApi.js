import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api/employees';
// const AUTH_URL = 'http://localhost:8080/api/auth';
const API = process.env.REACT_APP_API_URL;

const BASE_URL = `${API}/api/employees`;
const AUTH_URL = `${API}/api/auth`;
// ── Attach JWT token to every request automatically ──
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── If token expires, redirect to login ──
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser   = (data) => axios.post(`${AUTH_URL}/login`, data);
export const registerUser = (data) => axios.post(`${AUTH_URL}/register`, data);

// Employees
export const getAllEmployees  = ()         => axios.get(BASE_URL);
export const getEmployeeById  = (id)       => axios.get(`${BASE_URL}/${id}`);
export const createEmployee   = (data)     => axios.post(BASE_URL, data);
export const updateEmployee   = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteEmployee   = (id)       => axios.delete(`${BASE_URL}/${id}`);
export const searchEmployees  = (keyword)  => axios.get(`${BASE_URL}/search?keyword=${keyword}`);
export const getDashboardStats = ()        => axios.get(`${BASE_URL}/stats`);
export const uploadPhoto      = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};