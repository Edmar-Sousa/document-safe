import axios from 'axios';

import { useAuthStore } from '../store/auth-store';

const store = useAuthStore();


const http = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 10000,

    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(function (config) {

    if (store.isAuthenticated)
        config.headers.Authorization = `Bearer ${store.getAccessToken}`

    return config;
});

http.interceptors.response.use(function (config) {
    if (config.status == 401)
        store.clearAccessToken();

    return config
});

export default http;
