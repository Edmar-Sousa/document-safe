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

        /** vote tokens */
        const VoteToken = await ethers.getContractFactory('DocVoteToken')
        const voteToken = await VoteToken.deploy(owner.address);
        await voteToken.waitForDeployment();

        /** Token */
        const Token = await ethers.getContractFactory('DocToken');
        const token = await Token.deploy();
        await token.waitForDeployment();

        const [nftAddress, tokenAddress, voteTokenAddress] = await Promise.all([
            nft.getAddress(),
            token.getAddress(),
            voteToken.getAddress()
        ]);


        /** Staking */
        const Staking = await ethers.getContractFactory('DocStaking');
        const staking = await Staking.deploy(tokenAddress, voteTokenAddress);
        await staking.waitForDeployment();

        const stakingAddress = await staking.getAddress();

        /** Register */
        const DocRegister = await ethers.getContractFactory('DocRegisterDocument')
        const docRegister = await DocRegister.deploy(nftAddress, tokenAddress, stakingAddress);
        await docRegister.waitForDeployment();

        const registerAddress = await docRegister.getAddress();
        nft.transferOwnership(registerAddress);

        /** Set address doc register */
        await staking.setAddressRegisterDocument(registerAddress);
        await voteToken.transferOwnership(stakingAddress);

        return { owner, token, nft, docRegister, staking }
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
        const { owner, nft, token, staking, docRegister } = await deployDocuments();

        const registerAddress = await docRegister.getAddress();
        const tokensApproved = 10n * 10n ** 18n;

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

    it('Test reward when have tokens in stake', async () => {
        const { owner, token, staking, docRegister } = await deployDocuments();

        const [, otherWallet] = await ethers.getSigners();

        const tokensApproved = 10n * 10n ** 18n; // Quantidade de tokens para registrar um documento
        const tokensToTransfer = 40n * 10n ** 18n;

        const stakingAddress = await staking.getAddress();

        // Stake
        await token.transfer(otherWallet.address, tokensToTransfer);
        await token.connect(otherWallet).approve(stakingAddress, tokensApproved);
        await staking.connect(otherWallet).stake(tokensApproved);

        const stakingValue = await staking.connect(otherWallet).getStaking();
        expect(stakingValue).to.equal(tokensApproved);


        // Registrando o documento
        const registerAddress = await docRegister.getAddress();

        const hash = ethers.keccak256(ethers.toUtf8Bytes('file'))
        const cid = 'ifps://1234567';

        const message = ethers.solidityPackedKeccak256(
            ["bytes32", "address", "address"],
            [hash, owner.address, registerAddress]
        )
        
        const signer = await owner.signMessage(ethers.getBytes(message));
        await token.approve(registerAddress, tokensApproved);
        
        await expect(docRegister.registerDocument(hash, cid, signer))
            .to
            .emit(docRegister, 'DocumentRegistred')
            .withArgs(owner.address, hash);

        const reward = 98n * 10n ** 17n;
        const rewardGain = await staking.connect(otherWallet).getReward();

        expect(rewardGain).to.be.equals(reward);
    });
});
