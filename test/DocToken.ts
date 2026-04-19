import { expect } from 'chai';
import { network } from 'hardhat';


const { ethers } = await network.create();


describe('Tests Doc Token', async () => {

    it('Test deploy', async () => {
        const token = await ethers.deployContract('DocToken');
        await token.waitForDeployment();

        const address = await token.getAddress();

        expect(address).to.properAddress;
    });

    it('Test name token', async () => {
        const token = await ethers.deployContract('DocToken');
        await token.waitForDeployment();

        expect(await token.name()).to.equals('Document Token');
    });

});
