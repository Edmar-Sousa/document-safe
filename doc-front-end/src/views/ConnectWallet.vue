<template>

    <div class="w-full min-h-screen flex items-center flex-col justify-center bg-white z-50">
        <template v-if="isConnecting">
            <div class="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4">
            </div>
    
            <p class="text-gray-800 text-lg font-bold font-primary">
                Conectando à carteira...
            </p>
        </template>

        <template v-else-if="isError">
            <p class="text-gray-800 text-lg font-bold font-primary">
                Aconteceu algo de errado ao conectar a carteira!
            </p>
        </template>
    </div>


</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { onMounted, computed } from "vue";
import { useWalletStore, StateConnection } from "../store/wallet";


const walletStore = useWalletStore();
const router = useRouter();

const isConnecting = computed(() => walletStore.getStatus() == StateConnection.CONNECTING);
const isError = computed(() => walletStore.getStatus() == StateConnection.ERROR);

onMounted(() => {
    handleConnectWallet();
})

async function handleConnectWallet() {
    await walletStore.connectWallet();

    if (walletStore.isConnected())
        router.replace({ name: 'Home' });
}

</script>
