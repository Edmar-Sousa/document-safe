import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocRegisterDocument.sol/DocRegisterDocument.json';

import type { ethers } from 'ethers';



export class DocumentsContract extends ContractInstance {
    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_DOC_REGISTER_CONTRACT_ADDRESS;


    constructor(provider: ethers.BrowserProvider | ethers.Signer) {
        super(provider, DocumentsContract.address, DocumentsContract.abi);
    }

    async getAddress() {
        if (!this.instance) {
            throw new Error('Document contract instance not initialized!');
        }

        return await this.instance.getAddress();
    }

    async registerDocument(hash: string, cid: string, sig: string) {
        if (!this.instance) {
            throw new Error('Document contract instance not initialized!');
        }

        return await this.instance.registerDocument(hash, cid, sig);
    }
}

