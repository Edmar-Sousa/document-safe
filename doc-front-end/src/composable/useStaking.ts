import { ethers } from "ethers";
import { TokenContract } from "../utils/contracts/Token";
import { StakingContract } from "../utils/contracts/Staking";


let contractInstance: TokenContract | null = null;
let stakingContractInstance: StakingContract | null = null;

export function useStaking() {

    function createTokenInstance(provider: ethers.Signer) {
        if (!contractInstance) {
            contractInstance = new TokenContract(provider);
        }
    }

    function createStakingInstance(provider: ethers.Signer) {
        if (!stakingContractInstance) {
            stakingContractInstance = new StakingContract(provider);
        }
    }

    async function approveTokens(provider: ethers.Signer | null, amount: string, address: string) {
        if (!provider)
            throw new Error('Token contract instance not initialized!');

        createTokenInstance(provider);
        createStakingInstance(provider);

        return await contractInstance!.approve(
            address, 
            ethers.parseEther(String(amount))
        );
    }

    async function stakeTokens(provider: ethers.Signer | null, amount: string) {
        if (!provider)
            throw new Error('Staking contract instance not initialized!');

        createStakingInstance(provider);
        return await stakingContractInstance!.stake(ethers.parseEther(String(amount)));
    }

    async function getReardStaking(provider: ethers.Signer | null) {
        if (!provider)
            throw new Error('Staking contract instance not initialized!');
        
        createStakingInstance(provider);

        const reward = await stakingContractInstance!.getReward();
        const eth = Number(ethers.formatEther(reward));

        const fomatter = new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
        });


        return fomatter.format(eth);
    }

    async function unstakeTokens(provider: ethers.Signer | null, amount: string) {
        if (!provider)
            throw new Error('Staking contract instance not initialized!');
        
        createStakingInstance(provider);
        return await stakingContractInstance!.unstake(ethers.parseEther(String(amount)));
    }

    return {
        approveTokens,
        getReardStaking,
        stakeTokens,
        unstakeTokens,
    }

}
