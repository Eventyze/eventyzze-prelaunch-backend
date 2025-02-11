import axios from 'axios';
import { DYTE_API_KEY, DYTE_BASE_URL, DYTE_ORGANIZATION_ID } from './envKeys';

const axiosInstance = axios.create({
    baseURL: DYTE_BASE_URL,
    // headers: {
    // //   "Authorization": `Basic ${credentials}`,
    //   "Content-Type": "application/json",
    // },
    auth: {
        username: DYTE_ORGANIZATION_ID,
        password: DYTE_API_KEY
    }
  });
  
  axiosInstance.interceptors.request.use((config) => {
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  axiosInstance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default axiosInstance;