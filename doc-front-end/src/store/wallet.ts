import { ethers } from 'ethers';
import { defineStore } from 'pinia'
import { computed, markRaw, shallowRef } from 'vue';

export const StateConnection = {
    NOT_CONNECTED: 'not_connected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ERROR: 'error',
} as const;

export type StateConnectionType = (typeof StateConnection)[keyof typeof StateConnection];


export const useWalletStore = defineStore('wallet', () => {
    const provider = shallowRef<ethers.BrowserProvider | null>(null);
    const signer = shallowRef<ethers.Signer | null>(null);
    const status = shallowRef<StateConnectionType>(StateConnection.NOT_CONNECTED);
    const error = shallowRef<Error | null>(null);


    const getProvider = () => provider.value;
    const getSigner = () => signer.value;
    const getStatus = () => status.value;
    const isConnected = () => status.value == StateConnection.CONNECTED;

    const getEthereumFromWindow = () => {
        const ethereum = (window as any).ethereum;

        if (!ethereum)
            throw new Error('MetaMask não esta instalada!');

        return ethereum;
    }

    const requestAccessToWallet = async (ethereum: any) => {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        }

        catch (err: any) {
            if (err.code === 4001)
                throw new Error('Acesso à carteira negado pelo usuário!');

            throw new Error('Falha ao solicitar acesso à carteira!');
        }
    }

    const connectWallet = async () => {
        try {
            const ethereum = getEthereumFromWindow();
            status.value = StateConnection.CONNECTING;

            await requestAccessToWallet(ethereum);

            let browserProvider = new ethers.BrowserProvider(ethereum);
            let sign = await browserProvider.getSigner();

            provider.value = markRaw(browserProvider);
            signer.value = markRaw(sign);
            status.value = StateConnection.CONNECTED;
        }
        catch (err) {
            status.value = StateConnection.ERROR;
            error.value = err as Error;
        }
    }

    return {
        getProvider,
        getSigner,
        getStatus,
        isConnected,

        connectWallet,
    }
});
