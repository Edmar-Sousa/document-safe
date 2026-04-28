
import { ethers } from 'ethers';
import { type ShallowRef, toValue } from 'vue';

import { SellerContract } from '../utils/contracts/Seller';
import { OracleContract } from '../utils/contracts/Oracle';

let oracleContract: OracleContract | null = null;
let sellerContract: SellerContract | null = null;


type SignerParamType = ShallowRef<ethers.Signer | null> | ethers.Signer | null;
type ProviderParamType = ShallowRef<ethers.BrowserProvider | null> | ethers.BrowserProvider | null;


export function useSeller() {

    function createInstanceContract(signer: ethers.Signer) {
        if (!sellerContract) {
            sellerContract = new SellerContract(signer);
        }
    }

    function createInstanceOracle(provider: ethers.BrowserProvider) {
        if (!oracleContract) {
            oracleContract = new OracleContract(provider);
        }
    }

    function onBuyerTokens(callback: (address: string, amount: string) => void) { 
        if (!sellerContract)
            throw new Error('Seller contract instance not initialized!');

        sellerContract.on('TokensDOCTBought', callback);
    }

    async function getLastPrice(provider: ProviderParamType) {
        const providerValue = toValue(provider);

        if (!providerValue) {
            throw new Error('Oracle contract instance not initialized!');
        }

        createInstanceOracle(providerValue);
        return await oracleContract!.getLatestPrice();
    }

    async function getTokensPerEther(signer: SignerParamType) {
        const signerValue = toValue(signer);

        if (!signerValue) {
            throw new Error('Seller contract instance not initialized!');
        }

        createInstanceContract(signerValue);
        return await sellerContract!.tokensPerUsd();
    }

    async function buyTokens(ether: ethers.Signer | null, value: string) {
        if (!ether) {
            throw new Error('Seller contract instance not initialized!');
        }

        createInstanceContract(ether);
        await sellerContract!.buyTokens(ethers.parseEther(String(value)));
    }


    return {
        getTokensPerEther,
        getLastPrice,
        buyTokens,
        onBuyerTokens,
    }
}
