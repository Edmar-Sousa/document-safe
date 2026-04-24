<template>
    <div class="w-full max-w-150 mx-auto min-h-screen flex items-center justify-center flex-col">
        <div class="w-full px-4">
            <h1 class="text-3xl font-bold font-primary text-black-900">
                Registre-se
            </h1>
    
            <p class="text-base font-primary text-gray-300 mb-10">
                Faça seu cadastro para acessar a plataforma.
            </p>
        </div>

        <form @submit.prevent class="w-full px-4">
            <text-input 
                id="username" 
                label="Nome de Usuario" 
                placeholder="Digite seu nome de usuario"
                v-model="form.name">
                    <template #icon>
                        <UserRound :size="20" />
                    </template>
            </text-input>

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
                <button-component @click="handleRegister" :disabled="isLoadding">
                    {{ isLoadding ? 'Registrando...' : 'Registrar' }}
                </button-component>
            </div>
        </form>

        <div class="w-full px-4 mt-10 flex justify-between items-center">
            <p class="text-base text-gray-300">
                Já tem uma conta? 
            </p>

            <router-link :to="{ name: 'SignIn' }" class="text-blue-300 font-bold">
                Login!
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue';

import { RouterLink, useRouter } from 'vue-router';
import { UserRound, Lock, Mail } from '@lucide/vue';

import TextInput from '../components/TextInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';

import { useRegister } from '../composable/useRegister';

const form = reactive({
    name: '',
    email: '',
    password: '',
})


const { signUp, isLoadding } = useRegister();

const router = useRouter();

async function handleRegister() {
    const [data, error] = await signUp(form);

    if (error) {
        return;
    }

    router.push({ name: 'SignIn' });
}

</script>