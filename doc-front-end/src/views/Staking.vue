<template>

    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5">
            Faça o staking dos seus tokens DOCT e ganhe recompensas!
        </h1>

        <p class="text-gray-600 mb-5">
            Esta é a pagina de staking. Aqui você pode fazer o staking dos 
            seus tokens DOCT para ganhar recompensas. Quanto mais tokens 
            você fizer stake, maiores serão suas recompensas!
        </p>

        <form @submit.prevent class="w-full mx-auto mt-15 border border-gray-100 rounded-md p-5">
            <fieldset>
                <legend class="font-bold text-black-900 text-center">
                    Preencha os campos abaixo para fazer o staking dos seus tokens:
                </legend>
            </fieldset>

            <text-input
                type="number"
                placeholder="Quantidade de DOCT"
                id="doct-value"
                v-model="value" />


            <div class="w-full mt-5 flex items-center justify-between gap-4">
                <button-component class="flex-1" @click="handleStakeTokens" :disabled="isLoadding">
                    Fazer Staking
                </button-component>

                <button-component class="flex-1" @click="handleCollectStaking" :disabled="isLoadding">
                    Coletar Staking
                </button-component>
            </div>

            <p class="mt-5 font-bold">
                Problemas com o staking? 
                <router-link 
                    :to="{ name: 'ApproveTokens' }" 
                    class="text-blue-500">
                        Lembre de aprovar tokens
                </router-link>
            </p>
        </form>
    </div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import { ArrowLeft } from '@lucide/vue';
import { useStaking } from '../composable/useStaking';
import { useWalletStore } from '../store/wallet';

import TextInput from '../components/TextInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';

const value = ref<string>('');
const isLoadding = ref(false);

const { getSigner } = useWalletStore();
const { stakeTokens, unstakeTokens } = useStaking();



async function handleStakeTokens() {
    await stakeTokens(getSigner(), value.value);
    console.log('Staking realizado com sucesso!');
}

async function handleCollectStaking() {
    await unstakeTokens(getSigner(), value.value);
    console.log('Coleta de staking realizada com sucesso!');
}

</script>
