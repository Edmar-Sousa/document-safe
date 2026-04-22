import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.create();

describe('Tests Doc Nft', async () => {
    async function deployContract() {
        const [owner, user] = await ethers.getSigners();

        const ownerAddress = await owner.getAddress();

        const DocNFT = await ethers.getContractFactory('DocNft');
        const docNft = await DocNFT.deploy(ownerAddress);
        await docNft.waitForDeployment();

        return { owner, docNft }
    }

    it('Test deploy contract with owner', async () => {
        const { owner, docNft } = await deployContract();

        const ownerAddress = await owner.getAddress();
        const ownerContract = await docNft.owner();

        expect(ownerContract).to.be.equals(ownerAddress);
    });

    it('Test get cid does not exists', async () => {
        const { owner, docNft } = await deployContract();

        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const tx = docNft.getTokenCid(hash);

        expect(tx).to.be.revertedWith('Document does not exist.');
    });

    it('Test get cid', async () => {
        const { owner, docNft } = await deployContract();

        const wallet = ethers.Wallet.createRandom();
        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = "ifps://1234567";

        await docNft.mint(wallet.address, hash, cid);
        const cidStoraged = await docNft.getTokenCid(hash);

        expect(cidStoraged).to.be.equals(cid);
    });

    it('Test mint nft', async () => {
        const { owner, docNft } = await deployContract();

        const wallet = ethers.Wallet.createRandom();
        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = "ifps://1234567";

        await docNft.mint(wallet.address, hash, cid);
        const ownerOf = await docNft.ownerOf(hash);

        expect(ownerOf).to.be.equals(wallet.address);
    });

    it('Test mint nft already exists', async () => {
        const { owner, docNft } = await deployContract();

        const wallet = ethers.Wallet.createRandom();
        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = "ifps://1234567";

        await docNft.mint(wallet.address, hash, cid);
        const tx =  docNft.mint(wallet.address, hash, cid);

        expect(tx).to.be.revertedWith('The document already exists.');
    });


    it('Test trying to burn hash does not exists', async () => {
        const { owner, docNft } = await deployContract();

        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const tx = docNft.burn(hash);

        expect(tx).to.be.revertedWith('Document does not exist.');
    });

});
