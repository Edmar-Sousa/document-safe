<template>

    <div class="w-full flex items-center justify-end mt-10 mb-5 gap-3">
        <button-component @click="handleDao">
            DAO
        </button-component>

        <button-component @click="handleStaking">
            Staking
        </button-component>

        <button-component @click="handleBuyTokens">
            Comprar Tokens
        </button-component>
    </div>

    <user-balance />

    <div class="w-full">
        <div class="w-full mt-10 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800 mb-5">
                Documentos:
            </h1>
    
            <button-component @click="handleCreateDocument">
                Cadastrar documento
            </button-component>
        </div>

        <table class="w-full mt-10" >
            <thead>
                <tr class="bg-gray-200">
                    <th class="py-2">ID</th>
                    <th class="py-2">Nome</th>
                    <th class="py-2">Tamanho</th>
                    <th class="py-2">Data</th>
                </tr>
            </thead>

            <tbody>
                <template v-if="isLoadingRegisters">
                    <tr v-for="i in 10" :key="i">
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                    </tr>
                </template>

                <template v-else>
                    <tr 
                        v-for="register in filesRegistred.data" 
                        :key="register.id" 
                        class="text-center even:bg-gray-200"
                    >
                        <td class="py-2 px-2">{{ register.id }}</td>
                        <td class="py-2 px-2">{{ register.title }}</td>
                        <td class="py-2 px-2">{{ formatMb(register.size) }}</td>
                        <td class="py-2 px-2">{{ formatDate(register.createdAt) }}</td>
                    </tr>
                </template>
            </tbody>
        </table>

        <h1 class="text-2xl font-bold text-gray-800 mb-5 mt-10">
            Propostas:
        </h1>

        <table class="w-full mt-10" >
            <thead>
                <tr class="bg-gray-200">
                    <th class="py-2">ID:</th>
                    <th class="py-2">Descrição:</th>
                    <th class="py-2">Ações:</th>
                </tr>
            </thead>

            <tbody>
                <template v-if="isLoaddingProposals">
                    <tr v-for="i in 10" :key="i">
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                        <td class="py-2 px-2"><div class="skeleton h-8" /></td>
                    </tr>
                </template>

                <template v-else>
                    <tr 
                        v-for="proposal in proposalsCreated.data" 
                        :key="proposal.id" 
                        class="text-center even:bg-gray-200"
                    >
                        <td class="py-2 px-2">{{ proposal.id }}</td>
                        <td class="py-2 px-2">{{ proposal.description }}</td>
                        <td class="py-2 px-2 flex items-center justify-center gap-2">
                            <button-component class="" @click="handleViewProposal(proposal.proposalId)">
                                Ver
                            </button-component>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>

</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useFileUpload } from '../composable/useFileUpload';


import UserBalance from '../components/UserBalance.vue';
import ButtonComponent from '../components/ButtonComponent.vue';

import { useAsyncRequest } from '../composable/useAsync';
import { useProposals } from '../composable/useProposals';

const router = useRouter();

const { getFiles } = useFileUpload();
const { getProposals } = useProposals();


const {
    data: filesRegistred,
    isLoadding: isLoadingRegisters,
} = useAsyncRequest(() => getFiles());

const {
    data: proposalsCreated,
    isLoadding: isLoaddingProposals,
} = useAsyncRequest(() => getProposals())


function formatMb(size: number) {
    const sizeMb = (size / Math.pow(1024, 2)).toFixed(2);
    return `${sizeMb} MB`;
}

function formatDate(date: string) {
    const dateFormat = new Date(date);

    const formatedDate = dateFormat.toLocaleDateString('pt-BR', { dateStyle: 'short' });
    const formatedHour = dateFormat.toLocaleTimeString('pt-BR');

    return `${ formatedDate } ${ formatedHour }`;
}

function handleBuyTokens() {
    router.push({ name: 'BuyTokens' });
}

function handleStaking() {
    router.push({ name: 'Staking' });
}

function handleCreateDocument() {
    router.push({ name: 'RegisterDocument' });
}

function handleDao() {
    router.push({ name: 'Dao' });
}

function handleViewProposal(id: string) {
    router.push({ name: 'Proposal-dao', params: { proposalId: id } });
}

</script>