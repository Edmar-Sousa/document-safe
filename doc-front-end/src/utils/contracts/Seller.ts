import type { ethers } from 'ethers';

import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocSeller.sol/DocSeller.json';


export class SellerContract extends ContractInstance {
    
    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_SELLER_CONTRACT_ADDRESS;

    constructor(seller: ethers.Signer) {
        super(seller, SellerContract.address, SellerContract.abi);
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (!this.instance) {
            throw new Error('Seller contract instance not initialized!');
        }

        this.instance.on(event, callback);
    }
    
    async tokensPerUsd() {
        if (!this.instance) {
            throw new Error('Seller contract instance not initialized!');
        }

        return await this.instance.tokensPerUsd();
    }

    async buyTokens(amount: bigint) {
        if (!this.instance) {
            throw new Error('Seller contract instance not initialized!');
        }

        const tx = await this.instance.buyTokensDoc({ value: amount });
        await tx.wait();

        console.log('Tokens comprados com sucesso!');
    }
}
