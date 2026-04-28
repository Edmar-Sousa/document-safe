<template>

    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5">
            Você pode criar votações para mudar valores da plataforma.
        </h1>

        <p class="text-gray-600 mb-5">
            Esta pagina você cria uma proposta para que todos que tem staking possam votar.
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

            <text-input
                type="text"
                placeholder="Descrição"
                id="description"
                class="mt-4"
                v-model="form.description" />

            <select class="w-full min-h-16 mt-4 bg-gray-200 px-5 py-2 rounded-xl font-medium" v-model="form.contract">
                <option 
                    v-for="{value, option, selected} in options" 
                    :key="value"
                    :selected="!!selected"
                    :value="value">
                        {{ option }}
                </option>
            </select>

            <button-component class="w-full mt-5" @click="handlerCreateProposal" :disabled="isLoadding">
                Criar Proposta
            </button-component>
        </form>
    </div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import { ArrowLeft } from '@lucide/vue';

import { useWalletStore } from '../store/wallet';
import { useDao } from '../composable/useDao';

import TextInput from '../components/TextInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';


const form = ref({
    value: '',
    description: '',
    contract: 'tax_tokens',
});

const options = [
    { 
        value: 'tokens_per_usd', 
        option: 'Quantidade de tokens por USD',
        selected: true,
    },
    { 
        value: 'tax_tokens',
        option: 'Taxa de Tokens',
    }
];

const { getSigner } = useWalletStore();
const { createProposal } = useDao(getSigner());

const isLoadding = ref(false);

async function handlerCreateProposal() {
    isLoadding.value = true;
    await createProposal(form.value);
    isLoadding.value = false;

    console.log('Proposta criada');
}

</script>
