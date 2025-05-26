import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosInstance } from 'axios';
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

const API_BASE_URL = 'https://sustainable-be.code4fun.xyz/api/v1/';
// const API_BASE_URL = 'http://localhost:8080/api/v1/';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true, // if using cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        console.log("---------------------------------------aaaa: ", accessToken)
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            showMessage({
                message: 'Please log in again!',
                type: 'danger',
                icon: 'danger',
            });
            router.replace('/login');

            // const refreshToken = useAuthStore.getState().refreshToken;
            // if (refreshToken) {
            //   try {
            //     const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
            //     const newAccessToken = response.data.access_token;
            //     useAuthStore.setState({ accessToken: newAccessToken });
            //     error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            //     return api(error.config);
            //   } catch (refreshError) {
            //     console.error('Làm mới token thất bại:', refreshError);
            //     useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
            //     router.replace('/login');
            //   }
            // } else {
            //   router.replace('/login');
            // }
        }
        return Promise.reject(error);
    }
);

export default api;
