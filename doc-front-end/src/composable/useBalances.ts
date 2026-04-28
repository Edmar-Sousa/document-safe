import { ethers } from "ethers";
import { toValue } from "vue";

import { TokenContract } from "../utils/contracts/Token";
import { StakingContract } from "../utils/contracts/Staking";
import { VoteTokensContract } from "../utils/contracts/VoteTokens";


let contractInstance: TokenContract | null = null;
let stakingContractInstance: StakingContract | null = null;
let voteTokensContractInstance: VoteTokensContract | null = null;



export function useBalances() {


    async function getEthBalance(provider: ethers.BrowserProvider | null, signer: ethers.Signer | null) {
        const providerValue = toValue(provider);
        const signerValue = toValue(signer);

        
        if (!providerValue || !signerValue) 
            return '0.00';

        const address = await signerValue.getAddress();
        const balance = await providerValue.getBalance(address);

        const eth = Number(ethers.formatEther(balance));


        const fomatter = new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
        });

        return fomatter.format(eth);
    }

    function createTokenContractInstance(provider: ethers.Signer) {
        if (!contractInstance) {
            contractInstance = new TokenContract(provider);
        }
    }

    function createStakingContractInstance(provider: ethers.Signer) {
        if (!stakingContractInstance) {
            stakingContractInstance = new StakingContract(provider);
        }
    }

    function createVoteTokensContractInstance(provider: ethers.Signer) {
        if (!voteTokensContractInstance) {
            voteTokensContractInstance = new VoteTokensContract(provider);
        }
    }

    async function getDOCTBalance(provider: ethers.Signer | null) {

        if (!provider) {
            return '0.00';
        }

        createTokenContractInstance(provider);

        const address = await provider.getAddress();
        const balance = await contractInstance!.balanceOf(address);

        const eth = Number(ethers.formatEther(balance));

        const fomatter = new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
        });

        return fomatter.format(eth);
    }

    async function getVoteTokensBalance(provider: ethers.Signer | null) {
        if (!provider) {
            return '0.00';
        }

        createVoteTokensContractInstance(provider);

        const address = await provider.getAddress();
        const balance = await voteTokensContractInstance!.balanceOf(address);

        const eth = Number(ethers.formatEther(balance));
        
        const fomatter = new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
        });

        return fomatter.format(eth);
    }

    async function getStakedDOCTBalance(provider: ethers.Signer | null) {
        const providerValue = toValue(provider);

        if (!providerValue) {
            return '0.00';
        }

        createStakingContractInstance(providerValue);

        const balance = await stakingContractInstance!.getStaking();
        const eth = Number(ethers.formatEther(balance));

        const fomatter = new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
        });
        
        return fomatter.format(eth);
    }

    return {
        getEthBalance,
        getDOCTBalance,
        getVoteTokensBalance,
        getStakedDOCTBalance,
    }
}
