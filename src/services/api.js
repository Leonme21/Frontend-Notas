import axios from 'axios';

const api = axios.create({
  // Agregamos /api al final
  baseURL: 'https://backend-notas-5c06.onrender.com/api',
});

export default api;

