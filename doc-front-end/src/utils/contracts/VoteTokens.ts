import type { ethers } from 'ethers';
import { ContractInstance } from './Contract';

import TokenContractAbi from '../../contracts/DocVoteToken.sol/DocVoteToken.json';

export class VoteTokensContract extends ContractInstance {

    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_VOTE_TOKENS_CONTRACT_ADDRESS;

    constructor(provider: ethers.BrowserProvider | ethers.Signer) {
        super(provider, VoteTokensContract.address, VoteTokensContract.abi);
    }

    async balanceOf(address: string) {
        if (!this.instance) {
            throw new Error('Vote Tokens contract instance not initialized!');
        }
        
        return await this.instance.balanceOf(address)
    }

}

