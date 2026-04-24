import { defineStore } from 'pinia';

import { getItem } from '../utils/local-storage';


export const useAuthStore = defineStore('auth', {

    state: () => ({
        accessToken: getItem('accessToken') as string | null,
    }),

    getters: {
        isAuthenticated: (state) => state.accessToken !== null && state.accessToken.length,
    },

    actions: {
        setAccessToken(token: string) {
            this.accessToken = token;
        },
        clearAccessToken() {
            this.accessToken = null;
        }
    }
});

