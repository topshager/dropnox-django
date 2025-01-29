import axios from 'axios';

const api = axios.create({
baseURL:  'http://127.0.0.1:8000/'
});


api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem('access_token');
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

    if (error.response && error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if(!refreshToken){
          throw new Error("No refresh token found");

        }
        const response =await axios.post('http://127.0.0.1:8000/api/token/refresh/',{refresh: refreshToken});
        const { access } =response.data;


        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      }catch(refreshError){
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem("access_token")
        localStorage.getItem('refresh_token');
        window.location.href = '/login';
    }
  }

  return Promise.reject(error);
}
);
export default api;
