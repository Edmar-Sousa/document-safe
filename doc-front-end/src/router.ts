import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from './store/auth-store';
import { useWalletStore } from './store/wallet';
import { validateJwtToken } from './utils/token';


const routes = [
    { 
        path: '/register', 
        name: 'SignUp', 
        component: () => import('./views/SignUp.vue'),
        meta: {
            auth: false,
            public: true,
        },
    },
    { 
        path: '/login', 
        name: 'SignIn', 
        component: () => import('./views/SignIn.vue'),
        meta: {
            auth: false,
            public: true,
        },
    },
    { 
        path: '/', 
        redirect: '/dashboard' 
    },
    { 
        path: '/dashboard', 
        name: 'Dashboard', 
        component: () => import('./views/Dashboard.vue'), 

        meta: {
            auth: true,
        },

        children: [
            { 
                path: '', 
                name: 'Home', 
                component: () => import('./views/Home.vue'), 
                meta: {
                    auth: true,
                },
            },
            {
                path: 'conectar-carteira',
                name: 'ConnectWallet',
                component: () => import('./views/ConnectWallet.vue'),
                meta: {
                    auth: true,
                },
            },
            { 
                path: 'comprar-tokens', 
                name: 'BuyTokens', 
                component: () => import('./views/BuyTokens.vue'), 
                meta: {
                    auth: true,
                },
            },
            {
                path: 'staking',
                name: 'Staking',
                component: () => import('./views/Staking.vue'),
                meta: {
                    auth: true,
                },
            },
            {
                path: 'dao',
                name: 'Dao',
                component: () => import('./views/Dao.vue'),
                meta: {
                    auth: true,
                },
            },
            {
                path: 'proposta-dao/:proposalId',
                name: 'Proposal-dao',
                component: () => import('./views/Proposal.vue'),
                meta: {
                    auth: true,
                }
            },
            {
                path: 'aprovar-tokens',
                name: 'ApproveTokens',
                component: () => import('./views/Approve-Tokens.vue'),
                meta: {
                    auth: true,
                },
            },
            {
                path: 'register-document',
                name: 'RegisterDocument',
                component: () => import('./views/RegisterDocument.vue'),
                meta: {
                    auth: true,
                },
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {

    const routePublic = to.meta.public || false;

    if (routePublic) {
        return next();
    }

    const authStore = useAuthStore();
    const walletStore = useWalletStore();
    const routeHasAuth = to.meta.auth;

    if (routeHasAuth && (!authStore.isAuthenticated || !validateJwtToken(authStore.accessToken))) {
        return next({ name: 'SignIn' });
    }

    if (to.name != 'ConnectWallet' && !walletStore.isConnected()) {
        return next({ name: 'ConnectWallet' });
    }

    return next();
});

export default router;
