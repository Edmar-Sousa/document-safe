import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.create();


describe('Test Doc Register', async () => {
    async function deployDocuments() {
        const [owner] = await ethers.getSigners();

        /** NFT */
        const DocNft = await ethers.getContractFactory('DocNft');
        const nft = await DocNft.deploy(owner);
        await nft.waitForDeployment();

        /** Token */
        const Token = await ethers.getContractFactory('DocToken');
        const token = await Token.deploy();
        await token.waitForDeployment();

        const nftAddress = await nft.getAddress();
        const tokenAddress = await token.getAddress();

        /** Register */
        const DocRegister = await ethers.getContractFactory('DocRegisterDocument')
        const docRegister = await DocRegister.deploy(nftAddress, tokenAddress);
        await docRegister.waitForDeployment();

        const registerAddress = await docRegister.getAddress();
        nft.transferOwnership(registerAddress);

        return { owner, token, nft, docRegister }
    }


    it('Test insufficient tokens to complete the operation', async () => {
        const { owner, nft, docRegister } = await deployDocuments();

        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = 'ifps://1234567';
        const signer = await owner.signMessage(ethers.getBytes(hash));

        const tx = docRegister.registerDocument(hash, cid, signer);

        expect(tx).to.be.revertedWith('Insufficient tokens to complete the operation.');
    });

    it('Test sufficient tokens to complete the operation', async () => {
        const { owner, nft, token, docRegister } = await deployDocuments();

        const registerAddress = await docRegister.getAddress();
        const tokensApproved = 5n * 10n ** 18n;

        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = 'ifps://1234567';

        const message = ethers.solidityPackedKeccak256(
            ["bytes32", "address", "address"],
            [hash, owner.address, registerAddress]
        )
        
        const signer = await owner.signMessage(ethers.getBytes(message));

        await token.approve(registerAddress, tokensApproved);

        await expect(
            docRegister.registerDocument(hash, cid, signer)
        ).to.emit(docRegister, 'DocumentRegistred').withArgs(owner.address, hash);
    });
});
