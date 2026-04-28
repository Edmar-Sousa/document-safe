import type { ethers } from 'ethers';

import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocDAO.sol/DocDAO.json';


export class GovernorContract extends ContractInstance {

    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_DOC_DAO_CONTRACT_ADDRESS;

    constructor (provider: ethers.BrowserProvider | ethers.Signer) {
        super(provider, GovernorContract.address, GovernorContract.abi);
    }

    async propose(targets: string[], values: BigInt[], calldatas: any, description: string) {
        if (!this.instance) {
            throw new Error('Dao contract instance not initialized!')
        }

        return await this.instance.propose(targets, values, calldatas, description);
    }

    async castVote(proposalId: string, castVote: 0 | 1) {
        if (!this.instance) {
            throw new Error('Dao contract instance not initialized!')
        }

        return await this.instance.castVote(proposalId, castVote);
    }

    async state(proposalId: string) {
        if (!this.instance) {
            throw new Error('Dao contract instance not initialized!')
        }

        return await this.instance.state(proposalId);
    }
}
