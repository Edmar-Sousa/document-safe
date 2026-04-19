import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.create();


describe('Tests Doc Staking', async () => {
    async function deployContracts() {
        const [owner, user] = await ethers.getSigners();

        /** token */
        const Token = await ethers.getContractFactory('DocToken');
        const token = await Token.deploy();
        await token.waitForDeployment();

        const tokenAddress = await token.getAddress();

        /** staking */
        const Staking = await ethers.getContractFactory('DocStaking');
        const staking = await Staking.deploy(tokenAddress);
        await staking.waitForDeployment();

        return { owner, user, token, staking };
    }

    // it('Test staking does not have tokens', async () => {
    //     const { owner, staking, token } = await deployContracts();
    //     const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais

    //     const tx = staking.stake(tokensToStake);
    //     expect(tx).to.be.revertedWithCustomError(token, 'ERC20InsufficientAllowance')
    // });

    it('Test staking tokens', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const tokensContract = await token.balanceOf(stakingAddress);
        expect(tokensContract).to.be.equals(tokensToStake);

        const totalStaking = await staking.totalStaking();
        expect(totalStaking).to.be.equals(tokensToStake);
    });

    it('Test number of tokens exceeds approved values', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensApproved = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const tokensToStake = 2n * 10n ** 18n; // 2 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensApproved);
        const tx = staking.stake(tokensToStake);

        expect(tx).to.be.revertedWith('Insufficient number of tokens approved for transfer.');
    });


    it('Test unstake no tokens', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensTounstake = 1n * 10n ** 18n;
        const tx = staking.unstake(tokensTounstake);
        expect(tx).to.be.revertedWith('No tokens staked.');
    });

    it('Test staking tokens', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const tokensToUnstake = 2n * 10n ** 18n; // 2 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const tx = staking.unstake(tokensToUnstake);
        expect(tx).to.be.revertedWith('Insufficient number of tokens staked.');
    });

    it('Test Untake and trying to salvage it once again', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const tokensContract = await token.balanceOf(stakingAddress);
        expect(tokensContract).to.be.equals(tokensToStake);

        await staking.unstake(tokensToStake);
        const stakingTokens = await staking.getTokensStaking();
        
        expect(stakingTokens).to.be.equals(0);
    });

    it('Test stake percentage', async () => {
        const { owner, staking, token } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const [totalStaking, stakingValue, stakingPercentage] =  await Promise.all([
            staking.totalStaking(),
            staking.getTokensStaking(),
            staking.getGainPorcentage()
        ]);

        const percentage = 100n * stakingValue / totalStaking

        expect(stakingPercentage).to.be.equals(percentage);
    });

});
