
import { ethers } from 'ethers';
import { ContractInstance } from './Contract';
import TokenContractAbi from '../../contracts/DocToken.sol/DocToken.json';


export class TokenContract extends ContractInstance {

    static abi = TokenContractAbi.abi;
    static address = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

    constructor(provider: ethers.BrowserProvider | ethers.Signer) {
        super(provider, TokenContract.address, TokenContract.abi);
    }

    async approve(address: string, amount: ethers.BigNumberish) {
        if (!this.instance) {
            throw new Error('Token contract instance not initialized!');
        }

        return await this.instance.approve(address, amount);
    }

    async balanceOf(address: string) {
        if (!this.instance) {
            throw new Error('Token contract instance not initialized!');
        }


        return await this.instance.balanceOf(address)
    }

}
