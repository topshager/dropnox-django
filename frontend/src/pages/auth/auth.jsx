import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const api = axios.create({
baseURL:  'http://127.0.0.1:8000/'
});


api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem('token');
    if (token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) =>{
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response =await axios.post('http://127.0.0.1:8000/api/token/refresh/',{refresh: refreshToken});
        const { access } =response.data;


        localStorage.setItem('token', access);

        originalRequest.header.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      }catch(refreshError){
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
    }
  }

  return Promise.reject(error);
}
);
export default api;
