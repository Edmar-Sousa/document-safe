import { expect } from 'chai';
import { network } from 'hardhat';


const { ethers } = await network.create();


describe('Tests Doc Oracle', async () => {
    async function deployContracts(mockValue: number = 0, updatedAt: number = 0) {

        const mockChainLink = await ethers.deployContract('MockChainLink', [mockValue, updatedAt])
        await mockChainLink.waitForDeployment();
        const mockAddress = await mockChainLink.getAddress();

        const docOracle = await ethers.deployContract('DocOracle', [mockAddress])
        await docOracle.waitForDeployment();

        return [docOracle, mockChainLink]
    }

    it('Test get price', async () => {
        const mockValue = 2000e8;
        const updatedAt = Math.floor(Date.now() / 1000);

        const [docOracle,] = await deployContracts(mockValue, updatedAt);
        const price = await docOracle.getLastPrice();

        expect(price).to.equal(mockValue);
    });

    it('Test get outdated price', async () => {
        const block = await ethers.provider.getBlock("latest");

        const mockValue = 2000e8;
        const updatedAt = block!.timestamp - (3600 + 1);

        const [docOracle,] = await deployContracts(mockValue, updatedAt);

        await expect(docOracle.getLastPrice()).to.be.revertedWith('Outdated oracle price');
    });

    it('Test get price zero', async () => {
        const block = await ethers.provider.getBlock("latest");

        const mockValue = 0;
        const updatedAt = block!.timestamp;

        const [docOracle,] = await deployContracts(mockValue, updatedAt);

        await expect(docOracle.getLastPrice()).to.be.revertedWith('Invalid price');
    });

});
