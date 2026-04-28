import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocOracle.sol/DocOracle.json';

import type { ethers } from 'ethers';


export class OracleContract extends ContractInstance {
    
    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_ORACLE_CONTRACT_ADDRESS;

    constructor(provider: ethers.BrowserProvider) {
        super(provider, OracleContract.address, OracleContract.abi);
    }

    async getLatestPrice() {
        if (!this.instance) {
            throw new Error('Oracle contract instance not initialized!');
        }

        return await this.instance.getLastPrice();
    }
}
