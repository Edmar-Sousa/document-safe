import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.create();


describe('Test Doc Vote Token', async () => {
    async function deploysContracts() {
        const [owner, user] = await ethers.getSigners();

        const VoteToken = await ethers.getContractFactory('DocVoteToken');
        const voteToken = await VoteToken.deploy(owner.address);
        await voteToken.waitForDeployment();

        return { voteToken, owner };
    }

    it('Test deploy token vote', async () => {
        const { voteToken, owner } = await deploysContracts();
        const ownerTokenAddress = await voteToken.owner();

        expect(ownerTokenAddress).to.be.equals(owner.address);
    });

    it('Test send tokens to user', async () => {
        const { voteToken, owner } = await deploysContracts();
        const otherWallet = ethers.Wallet.createRandom();
        const tokensToTransfer = 10n * 10n ** 18n;

        await voteToken.mint(otherWallet.address, tokensToTransfer);
        const balance = await voteToken.balanceOf(otherWallet.address);

        expect(balance).to.be.equals(tokensToTransfer);
    });

    it('Test send tokens to user and burn', async () => {
        const { voteToken, owner } = await deploysContracts();
        const otherWallet = ethers.Wallet.createRandom();
        const tokensToTransfer = 10n * 10n ** 18n;

        // Mint tokens
        await voteToken.mint(otherWallet.address, tokensToTransfer);
        const balanceAfterMint = await voteToken.balanceOf(otherWallet.address);

        expect(balanceAfterMint).to.be.equals(tokensToTransfer);

        // Burn tokens
        await voteToken.burn(otherWallet.address, tokensToTransfer);
        const balanceAfterBurn = await voteToken.balanceOf(otherWallet.address);

        expect(balanceAfterBurn).to.be.equals(0);
    });
});
