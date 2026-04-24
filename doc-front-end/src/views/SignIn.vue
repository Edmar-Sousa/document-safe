<template>
    <div class="w-full max-w-150 mx-auto min-h-screen flex items-center justify-center flex-col">
        <div class="w-full px-4">
            <h1 class="text-3xl font-bold font-primary text-black-900">
                Login
            </h1>
    
            <p class="text-base font-primary text-gray-300 mb-10">
                Faça login para acessar a plataforma.
            </p>
        </div>

        <form @submit.prevent class="w-full px-4">
            <text-input 
                id="email" 
                label="Email" 
                placeholder="Digite seu email"
                type="email"
                class="mt-5"
                v-model="form.email">
                    <template #icon>
                        <Mail :size="20" />
                    </template>
            </text-input>

            <text-input 
                id="password" 
                label="Senha" 
                placeholder="Digite sua senha"
                type="password"
                class="mt-5"
                v-model="form.password">
                    <template #icon>
                        <Lock :size="20" />
                    </template>
            </text-input>

            <div class="mt-10 flex justify-end">
                <button-component @click="handleSignIn" :disabled="isLoadding">
                    {{ isLoadding ? 'Entrando...' : 'Entrar' }}
                </button-component>
            </div>
        </form>

        <div class="w-full px-4 mt-10 flex justify-between items-center">
            <p class="text-base text-gray-300">
                Não tem uma conta? 
            </p>

            <router-link :to="{ name: 'SignUp' }" class="text-blue-300 font-bold">
                Registre-se!
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { Lock, Mail } from '@lucide/vue';
import { useRouter } from 'vue-router';

import { useLogin } from '../composable/useLogin';
import { useAuthStore } from '../store/auth-store';
import { setItem } from '../utils/local-storage';

import TextInput from '../components/TextInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';


const form = reactive({
    email: '',
    password: ''
});

const { signIn, isLoadding } = useLogin();

const router = useRouter();
const authStore = useAuthStore();


async function handleSignIn() {
    const [response, error] = await signIn(form);

    if (error || !response)
        return;

    authStore.setAccessToken(response.data.accessToken);
    setItem('accessToken', response.data.accessToken);

    router.push({ name: 'Dashboard' });
}

</script>