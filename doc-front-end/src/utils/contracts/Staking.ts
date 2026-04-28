
import type { ethers } from 'ethers';

import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocStaking.sol/DocStaking.json';


export class StakingContract extends ContractInstance {

    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_STAKING_CONTRACT_ADDRESS;
    

    constructor(provider: ethers.BrowserProvider | ethers.Signer) {
        super(provider, StakingContract.address, StakingContract.abi);
    }

    async getAddress() {
        if (!this.instance) {
            throw new Error('Staking contract instance not initialized!');
        }

        return await this.instance.getAddress();
    }

    async getReward() {
        if (!this.instance) {
            throw new Error('Staking contract instance not initialized!');
        }

        return await this.instance.getReward();
    }

    async stake(amount: ethers.BigNumberish) {
        if (!this.instance) {
            throw new Error('Staking contract instance not initialized!');
        }

        return await this.instance.stake(amount);
    }

    async unstake(amount: ethers.BigNumberish) {
        if (!this.instance) {
            throw new Error('Staking contract instance not initialized!');
        }

        return await this.instance.unstake(amount);
    }

    async getStaking() {
        if (!this.instance) {
            throw new Error('Staking contract instance not initialized!');
        }

        return await this.instance.getStaking();
    }
}
