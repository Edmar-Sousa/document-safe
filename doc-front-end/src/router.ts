import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from './store/auth-store';
import { validateJwtToken } from './utils/token';

const routes = [
    { path: '/register', name: 'SignUp', component: () => import('./views/SignUp.vue') },
    { path: '/login', name: 'SignIn', component: () => import('./views/SignIn.vue') },
    { 
        path: '/dashboard', 
        name: 'Dashboard', 
        component: () => import('./views/Dashboard.vue'), 
        meta: {
            auth: true,
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {

    const authStore = useAuthStore();
    const routeHasAuth = to.meta.auth;

    if (routeHasAuth && (!authStore.isAuthenticated || !validateJwtToken(authStore.accessToken))) {
        next({ name: 'SignIn' });
    }

    next();
});

export default router;
