<template>

    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5">
            Alguns contratos exigem que você aprove os tokens antes de usá-los.
        </h1>

        <p class="text-gray-600 mb-5">
            Esta é a pagina de aprovação de tokens. Aqui você pode aprovar os 
            seus tokens DOCT para usá-los em contratos. Quanto mais tokens 
            você aprovar, mais fácil será usá-los!
        </p>

        <form @submit.prevent class="w-full mx-auto mt-15 border border-gray-100 rounded-md p-5">
            <fieldset>
                <legend class="font-bold text-black-900 text-center">
                    Preencha os campos abaixo para fazer a aprovação dos seus tokens:
                </legend>
            </fieldset>

            <text-input
                type="number"
                placeholder="Quantidade de DOCT"
                id="doct-value"
                class="mt-4"
                v-model="form.value" />

            <select class="w-full min-h-16 mt-4 bg-gray-200 px-5 py-2 rounded-xl font-medium" v-model="form.address">
                <option 
                    v-for="{value, option, selected} in options" 
                    :key="value"
                    :selected="!!selected"
                    :value="value">
                        {{ option }}
                </option>
            </select>

            <button-component class="w-full mt-5" @click="handlerApproveTokens" :disabled="isLoadding">
                Aprovar Tokens
            </button-component>
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


const { getSigner } = useWalletStore();
const { approveTokens } = useStaking();

const form = ref({
    value: '',
    address: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
})

const isLoadding = ref(false);


const options = [
    { 
        value: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS as string, 
        option: 'Contrato de Staking',
        selected: true,
    },
    { 
        value: import.meta.env.VITE_DOC_REGISTER_CONTRACT_ADDRESS as string,
        option: 'Contrato de Registro Documentos',
    }
]


async function handlerApproveTokens() {
    isLoadding.value = true;
    const { value, address } = form.value
    await approveTokens(getSigner(), value, address);
    isLoadding.value = false;

    console.log('Tokens Aprovados');
}


</script>
