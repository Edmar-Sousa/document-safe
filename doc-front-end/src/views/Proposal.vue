<template>
    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5">
            Proposta Criada Pela Comunidade.
        </h1>

        <p class="text-gray-600 mb-5">
            Proposta para mudar algo na plataforma. Se você tiver tokens de votação poderar participar.
        </p>

        <div class="w-75 h-5 skeleton" v-if="isLoaddingState"></div>

        <p v-else>
            Estado da votação: {{ state }}
        </p>
    </div>
</template>

<script setup lang="ts">

import { ArrowLeft } from '@lucide/vue';
import { useRoute } from 'vue-router';
import { useAsyncRequest } from '../composable/useAsync';
import { useDao } from '../composable/useDao';
import { useWalletStore } from '../store/wallet';
import { computed } from 'vue';


const { getSigner } = useWalletStore();
const { stateProposal } = useDao(getSigner());


const route = useRoute()

const {
    data: proposalState,
    isLoadding: isLoaddingState,
} = useAsyncRequest(() => stateProposal(route.params.proposalId as string))


const state = computed(() => {
    switch (Number(proposalState.value)) {
        case 0: return "Pending";
        case 1: return "Active";
        case 2: return "Canceled";
        case 3: return "Defeated";
        case 4: return "Succeeded";
        case 5: return "Queued";
        case 6: return "Expired";
        case 7: return "Executed";
    }
})

</script>