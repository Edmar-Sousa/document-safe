import { network } from 'hardhat';


const { ethers } = await network.create();


/**
 * Função para fazer o deploy dos tokens: DocToken, DocVoteToken e DocNFT.
 */
async function deployTokens(owner: any) {
    const TokenContract = await ethers.getContractFactory('DocToken');
    const token = await TokenContract.deploy();
    await token.waitForDeployment();

    const TokenNFTContract = await ethers.getContractFactory('DocNft');
    const tokenNft = await TokenNFTContract.deploy(owner);
    await tokenNft.waitForDeployment();

    const VoteTokenContract = await ethers.getContractFactory('DocVoteToken');
    const voteToken = await VoteTokenContract.deploy(owner);
    await voteToken.waitForDeployment();

    const [tokenAddress, tokenNftAddress, voteTokenAddress] = await Promise.all([
        token.getAddress(),
        tokenNft.getAddress(),
        voteToken.getAddress()
    ]);

    return { 
        tokenAddress, 
        tokenNftAddress, 
        voteTokenAddress,
        token,
        tokenNft,
        voteToken,
    }
}


/**
 * Função de deploy do oraculo e chainlink
 */
async function deployOracle() {
    const mockValue = 2000e8;
    const updatedAt = Math.floor(Date.now() / 1000);

    // TODO: modificar de acordo com a rede
    const MockChainLinkContract = await ethers.getContractFactory('MockChainLink');
    const chainLink = await MockChainLinkContract.deploy(mockValue, updatedAt);
    await chainLink.waitForDeployment();

    const chainLinkAddress = await chainLink.getAddress();
    // const chainLinkAddress = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

    const OracleContract = await ethers.getContractFactory('DocOracle');
    const oracle = await OracleContract.deploy(chainLinkAddress);
    await oracle.waitForDeployment();

    const oracleAddress = await oracle.getAddress();

    return { oracleAddress, oracle };
}

/**
 * Função de deploy do contrato de seller.
 * 
 * @param tokenAddress 
 * @param oracleAddress 
 * @returns 
 */
async function deploySeller(tokenAddress: string, oracleAddress: string) {
    const SellerContract = await ethers.getContractFactory('DocSeller');
    const seller = await SellerContract.deploy(oracleAddress, tokenAddress);
    await seller.waitForDeployment();

    const sellerAddress = await seller.getAddress();

    return { seller, sellerAddress };
}

/**
 * Deploy do contrato de staking.
 * 
 * @param tokenAddress 
 * @param voteTokenAddress 
 * @returns 
 */
async function deployStaking(tokenAddress: string, voteTokenAddress: string) {
    const StakingContract = await ethers.getContractFactory('DocStaking');
    const staking = await StakingContract.deploy(tokenAddress, voteTokenAddress);
    await staking.waitForDeployment();

    const stakingAddress = await staking.getAddress();

    return { stakingAddress, staking };
}

/**
 * Função para deploy do contrato de registro de documento
 * 
 * @param tokenNftAddress 
 * @param tokenAddress 
 * @param stakingAddress 
 * @returns 
 */
async function deployRegister(tokenNftAddress: string, tokenAddress: string, stakingAddress: string) {
    const RegisterDocument = await ethers.getContractFactory('DocRegisterDocument');
    const registerDocument = await RegisterDocument.deploy(tokenNftAddress, tokenAddress, stakingAddress);
    await registerDocument.waitForDeployment();

    const registerDocAddress = await registerDocument.getAddress();

    return {
        registerDocAddress,
        registerDocument,
    }
}

/**
 * Deploy do contrato de timelock
 * 
 * @param delay 
 * @param proposers 
 * @param executors 
 * @param admin 
 * @returns 
 */
async function deployTimelock(delay: number, proposers: string[], executors: string[], admin: string) {
    const TimeLock = await ethers.getContractFactory('DocTimeLock');
    const timelock = await TimeLock.deploy(
        delay,
        proposers,
        executors,
        admin
    );
    await timelock.waitForDeployment();

    const timeLockAddress = await timelock.getAddress();

    return {
        timeLockAddress,
        timelock,
    }
}

/**
 * Deploy do DAO
 * 
 * @param voteTokenAddress 
 * @returns 
 */
async function deployDao(voteTokenAddress: string) {
    const DaoContract = await ethers.getContractFactory('DocDAO');
    const dao = await DaoContract.deploy(voteTokenAddress);
    await dao.waitForDeployment();

    const daoAddress = await dao.getAddress();

    return {
        dao,
        daoAddress,
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(`Deploy contracts with address ${deployer.address}`);
    console.log(`Deploy on network: ${ethers.Network.name}`);

    const { 
        tokenAddress, 
        tokenNftAddress, 
        voteTokenAddress, 
        token, 
        tokenNft,
        voteToken
    } = await deployTokens(deployer);

    const { oracleAddress } = await deployOracle();
    const { sellerAddress, seller } = await deploySeller(tokenAddress, oracleAddress);

    const { stakingAddress, staking } = await deployStaking(tokenAddress, voteTokenAddress);
    const { registerDocAddress, registerDocument } = await deployRegister(tokenNftAddress, tokenAddress, stakingAddress);
    const { daoAddress } = await deployDao(voteTokenAddress);
    const { timeLockAddress } = await deployTimelock(
        300, // 5 min,
        [deployer.address],
        [deployer.address],
        deployer.address
    );

    // Approve tokens to seller
    const tokensTransfer = 100000000n * 10n ** 18n;
    await token.transfer(sellerAddress, tokensTransfer);

    // Change ownerships
    await tokenNft.transferOwnership(registerDocAddress);
    await voteToken.transferOwnership(stakingAddress);
    await staking.setAddressRegisterDocument(registerDocAddress);

    await seller.setDaoAddress(daoAddress);
    await registerDocument.setDaoAddress(daoAddress);


    console.log('Deployment completed successfully!');
    console.log('Contracts addresses:');
    console.log(`DocToken: ${tokenAddress}`);
    console.log(`DocNFT: ${tokenNftAddress}`);
    console.log(`DocVoteToken: ${voteTokenAddress}`);
    console.log(`DocOracle: ${oracleAddress}`);
    console.log(`DocSeller: ${sellerAddress}`);
    console.log(`DocStaking: ${stakingAddress}`);
    console.log(`DocRegisterDocument: ${registerDocAddress}`);
    console.log(`DocDAO: ${daoAddress}`);
    console.log(`DocTimeLock: ${timeLockAddress}`);
}

main()
.catch(err => {
    console.log(err);
    process.exitCode = 1;
});
