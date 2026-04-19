
import { expect } from 'chai';
import { network } from 'hardhat';


const { ethers } = await network.create();


describe('Tests Doc Seller', async () => {
    async function deployContracts(mockValue: BigInt, updatedAt: number = 0) {
        const doctToken = await ethers.deployContract('DocToken');
        await doctToken.waitForDeployment();

        const mockChainLink = await ethers.deployContract('MockChainLink', [mockValue, updatedAt])
        await mockChainLink.waitForDeployment();
        const mockAddress = await mockChainLink.getAddress();

        const docOracle = await ethers.deployContract('DocOracle', [mockAddress])
        await docOracle.waitForDeployment();

        const docSellerMock = await ethers.deployContract('MockSeller', [docOracle, doctToken]);
        await docSellerMock.waitForDeployment();

        return docSellerMock;
    }

    it('Test convert ETH to USD', async () => {
        const mockValue = 10n ** 8n; // 100000000
        const ethValue = ethers.parseEther('1');
        const expected = 10n ** 8n; // (1e8 * 1e18) / 1e18

        const updatedAt = Math.floor(Date.now() / 1000);

        const docSellerMock = await deployContracts(mockValue, updatedAt);
        const price = await docSellerMock._getUsdValue(ethValue);

        expect(price).to.equal(expected);
    });

    it('Test convert ETH in DOCT', async () => {
        const mockValue = 10n ** 8n; // 100000000
        const ethValue = ethers.parseEther('1');

        // Assumindo que o valor de 1 USD -> 100 DOCT
        const expected = 100;

        const updatedAt = Math.floor(Date.now() / 1000);

        const docSellerMock = await deployContracts(mockValue, updatedAt);
        const price = await docSellerMock._getNumberTokens(ethValue);

        const decimals = 10n ** 18n;

        expect(price / decimals).to.equal(expected);
    });


    async function deployContractsWithOwner() {
        const mockValue = 10n ** 8n;
        const updatedAt = Math.floor(Date.now() / 1000);

        const [owner, user] = await ethers.getSigners();

        /* token */
        const Token = await ethers.getContractFactory('DocToken');
        const token = await Token.deploy();
        await token.waitForDeployment();

        const tokenAddress = await token.getAddress();

        /* chainlink */
        const MockChainLink = await ethers.getContractFactory('MockChainLink');
        const mockChainLink = await MockChainLink.deploy(mockValue, updatedAt);
        await mockChainLink.waitForDeployment();

        const chainLinkMockAddress = await mockChainLink.getAddress();

        /* oraculo */
        const Oracle = await ethers.getContractFactory('DocOracle');
        const oracle = await Oracle.deploy(chainLinkMockAddress);
        await oracle.waitForDeployment();

        const oracleAddress = await oracle.getAddress()

        // /* seller */
        const Seller = await ethers.getContractFactory('MockSeller');
        const seller = await Seller.deploy(oracleAddress, tokenAddress);
        await seller.waitForDeployment();

        return { seller, token, mockChainLink, oracle, owner, user }
    }

    async function createWallet(owner: any) {
        const wallet = ethers.Wallet.createRandom().connect(ethers.provider);

        await owner.sendTransaction({
            to: wallet.address,
            value: ethers.parseEther('5')
        });

        return wallet;
    }

    it('Should buy tokens successfully', async () => {
        const { seller, token, owner } = await deployContractsWithOwner();
        
        const ownerAddress = await owner.getAddress();
        const ownerContract = await seller._getTokenOwner();

        expect(ownerContract).to.equals(ownerAddress);

        const sellerAddress = await seller.getAddress();
        const approveToken = 200n * 10n ** 18n; // 200 * 1e18
        const expectedDoct = 100n * 10n ** 18n;

        await token.approve(sellerAddress, approveToken);
        const allowance = await token.allowance(ownerAddress, sellerAddress);

        expect(allowance).to.equals(approveToken);

        const otherWallet = await createWallet(owner);        
        const tx = await seller.connect(otherWallet).buyTokensDoc({
            value: ethers.parseEther('1')
        });

        expect(await token.balanceOf(otherWallet.address)).to.equals(expectedDoct);
    });


    it('Should buy tokens with zero eth', async () => {
        const { seller, token, owner } = await deployContractsWithOwner();

        const otherWallet = await createWallet(owner);        
        const sellerAddress = await seller.getAddress();

        const approveToken = 100n * 10n ** 18n; // 100 * 1e18
        await token.approve(sellerAddress, approveToken);

        expect(seller.connect(otherWallet).buyTokensDoc()).to.be.revertedWith('Error when buying tokens with this value.');
    });

    it('Trying to buy more tokens than was approved', async () => {
        const { seller, token, owner } = await deployContractsWithOwner();

        const otherWallet = await createWallet(owner);        
        const sellerAddress = await seller.getAddress();

        const approveToken = 100n * 10n ** 18n; // 100 * 1e18
        await token.approve(sellerAddress, approveToken);

        const tx = seller.connect(otherWallet).buyTokensDoc({
            value: ethers.parseEther('3')
        });

        expect(tx).to.be.revertedWith('Insufficient Harvest Balance to make the purchase');
    });
});
