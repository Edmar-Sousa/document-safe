import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.create();


describe('Tests Doc Staking', async () => {
    async function deployContracts() {
        const [owner, user] = await ethers.getSigners();

        /** vote tokens */
        const VoteToken = await ethers.getContractFactory('DocVoteToken')
        const voteToken = await VoteToken.deploy(owner.address);
        await voteToken.waitForDeployment();


        /** token */
        const Token = await ethers.getContractFactory('DocToken');
        const token = await Token.deploy();
        await token.waitForDeployment();


        const [tokenAddress, voteTokenAddress] = await Promise.all([
            token.getAddress(),
            voteToken.getAddress()
        ]);

        /** staking */
        const Staking = await ethers.getContractFactory('DocStaking');
        const staking = await Staking.deploy(tokenAddress, voteTokenAddress);
        await staking.waitForDeployment();

        const stakingAddress = await staking.getAddress();
        await voteToken.transferOwnership(stakingAddress);

        return { owner, user, token, staking, voteToken };
    }

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

    it('Test staking tokens with vote tokens', async () => {
        const { owner, staking, token, voteToken } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const tokensContract = await token.balanceOf(stakingAddress);
        expect(tokensContract).to.be.equals(tokensToStake);

        const totalStaking = await staking.totalStaking();
        expect(totalStaking).to.be.equals(tokensToStake);

        const voteTokens = await voteToken.balanceOf(owner.address);
        expect(voteTokens).to.be.equals(tokensToStake);
    });

    it('Test unstaking tokens with vote tokens', async () => {
        const { owner, staking, token, voteToken } = await deployContracts();

        const tokensToStake = 1n * 10n ** 18n; // 1 token com 18 casas decimais
        const stakingAddress = await staking.getAddress();

        await token.approve(stakingAddress, tokensToStake);
        await staking.stake(tokensToStake);

        const tokensContract = await token.balanceOf(stakingAddress);
        expect(tokensContract).to.be.equals(tokensToStake);

        const totalStaking = await staking.totalStaking();
        expect(totalStaking).to.be.equals(tokensToStake);

        const voteTokens = await voteToken.balanceOf(owner.address);
        expect(voteTokens).to.be.equals(tokensToStake);

        await staking.unstake(tokensToStake);
        const voteTokenAfterUnstake = await voteToken.balanceOf(owner.address);
        expect(voteTokenAfterUnstake).to.be.equals(0);
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
        const tokensContractAfterUnstake = await token.balanceOf(stakingAddress);
        
        expect(tokensContractAfterUnstake).to.be.equals(0);
    });

});
