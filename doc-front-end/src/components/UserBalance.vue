<template>

    {{ error }}

    <div class="gap-2 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        <card-component 
            title="Saldo em ETH" 
            :value="ethBalance || '0.00'" 
            simbols="ETH"
            :loading="isLoadingEthBalance" />
        
        <card-component 
            title="Tokens" 
            :value="docTBalance || '0.00'" 
            simbols="DOCT"
            :loading="isLoaddingDocTBalance" />
        
        <card-component 
            title="Tokens em Staking" 
            :value="stakingBalance || '0.00'" 
            simbols="DOCT"
            :loading="isLoadingStakingBalance" />

        <card-component 
            title="Tokens de Votação" 
            :value="voteTokensBalance || '0.00'" 
            simbols="sDOCT"
            :loading="isLoadingVoteTokensBalance" />

        <card-component 
            title="Recompensa de Staking" 
            :value="rewardStaking || '0.00'" 
            simbols="DOCT"
            :loading="isLoadingRewardStaking" />
    </div>

</template>

<script setup lang="ts">

import { useWalletStore, StateConnection } from '../store/wallet';

import { useAsyncRequest } from '../composable/useAsync';
import { useBalances } from '../composable/useBalances';
import { useStaking } from '../composable/useStaking';

import CardComponent from '../components/CardComponent.vue';

const walletStore = useWalletStore();

const { 
    getEthBalance, 
    getDOCTBalance, 
    getStakedDOCTBalance, 
    getVoteTokensBalance
} = useBalances();

const { 
    getReardStaking,
} = useStaking();


const provider = walletStore.getProvider();
const signer = walletStore.getSigner();



const { 
    isLoadding: isLoadingEthBalance, 
    data: ethBalance,
    error,
} = useAsyncRequest<string>(() => getEthBalance(provider, signer));

const {
    isLoadding: isLoaddingDocTBalance,
    data: docTBalance,
} = useAsyncRequest<string>(() => getDOCTBalance(signer));

const {
    isLoadding: isLoadingStakingBalance,
    data: stakingBalance,
} = useAsyncRequest<string>(() => getStakedDOCTBalance(signer));

const {
    isLoadding: isLoadingVoteTokensBalance,
    data: voteTokensBalance,
} = useAsyncRequest<string>(() => getVoteTokensBalance(signer));

const {
    data: rewardStaking,
    isLoadding: isLoadingRewardStaking,
} = useAsyncRequest(() => getReardStaking(signer));


</script>