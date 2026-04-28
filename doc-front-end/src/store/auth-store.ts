import { defineStore } from 'pinia';

import { getItem, removeItem } from '../utils/local-storage';


export const useAuthStore = defineStore('auth', {

    state: () => ({
        accessToken: getItem('accessToken') as string | null,
    }),

    getters: {
        isAuthenticated: (state) => state.accessToken !== null && state.accessToken.length,
        getAccessToken: (state) => state.accessToken,
    },

    actions: {
        setAccessToken(token: string) {
            this.accessToken = token;
        },
        clearAccessToken() {
            this.accessToken = null;
            removeItem('accessToken');
        },
    }
});

