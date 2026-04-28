<template>

    {{ error }}


    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5">
            Comprar Tokens
        </h1>

        <p class="text-gray-600 mb-5">
            Esta é a página de compra de tokens. Aqui você pode adquirir tokens para usar em nossa plataforma.
        </p>

        <form @submit.prevent class="w-full mx-auto mt-15 border border-gray-100 rounded-md p-5">
            <fieldset>
                <legend class="font-bold text-black-900 text-center">
                    Preencha os campos abaixo para comprar tokens:
                </legend>
            </fieldset>

            <div class="mt-10">
                <div v-show="isLoaddingTokensPerUsd" class="h-5 mx-auto w-full max-w-37.5 skeleton"></div>
    
                <p v-show="!isLoaddingTokensPerUsd" class="font-base font-bold text-black-900 text-center">
                    1 USD = {{ tokensPerEther }} DOCT
                </p>
            </div>

            <text-input
                type="number"
                placeholder="Quantidade de ETH"
                id="eth-value"
                v-model="value" />

            <p class="font-base font-bold text-black-900 text-center mt-10">
                O valor estimado em DOCT será: 
                <span class="text-blue-500">{{ extimatedTokens }}</span>
            </p>

            <button-component class="w-full mt-10" @click="handleBuyTokens" :disabled="isLoadding">
                Comprar Tokens
            </button-component>
        </form>
    </div>

</template>


<script setup lang="ts">

import { computed, ref } from 'vue';
import { ArrowLeft } from '@lucide/vue';

import { useWalletStore } from '../store/wallet';
import { useAsyncRequest } from '../composable/useAsync';
import { useSeller } from '../composable/useSeller';

import { ethers } from 'ethers';

import TextInput from '../components/TextInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';

const { 
    getProvider, 
    getSigner,
} = useWalletStore();

const { 
    getTokensPerEther, 
    getLastPrice, 
    buyTokens, 
    onBuyerTokens,
} = useSeller();

const { 
    data: tokensPerEther, 
    isLoadding: isLoaddingTokensPerUsd,
    error,
} = useAsyncRequest(() => getTokensPerEther(getSigner()));

const {
    data: lastPriceUsd,
    isLoadding: isLoaddingLastPriceUsd,
} = useAsyncRequest(() => getLastPrice(getProvider()));



const extimatedTokens = computed(() => {
    if (isLoaddingTokensPerUsd.value || isLoaddingLastPriceUsd.value) {
        return '...';
    }

    const ethValue = ethers.parseEther(String(value.value || '0'));
    const price = BigInt(lastPriceUsd.value || '0');
    const tokensPerUsd = BigInt(tokensPerEther.value || '0');

    const usdValue = (ethValue * price) / 10n ** 18n;
    const tokens = (usdValue * tokensPerUsd * 10n ** 18n) / 10n ** 8n;

    return ethers.formatEther(tokens);
});


const value = ref<string>('');
const isLoadding = ref(false);

async function handleBuyTokens() {
    isLoadding.value = true;
    await buyTokens(getSigner(), value.value);
    isLoadding.value = false;

    onBuyerTokens(handleTokensPurchased);
}

function handleTokensPurchased(address: string, amount: string) {
    console.log(`Tokens comprados por ${address}: ${amount}`);
}

</script>
