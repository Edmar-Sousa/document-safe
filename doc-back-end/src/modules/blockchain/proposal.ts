import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Contract, ethers } from "ethers";

import { BlockchainProvider } from "./blockchain.provider";

import ContractAbi from '../../contracts/DocDAO.sol/DocDAO.json'

@Injectable()
export class BlockchainProposalListener implements OnModuleInit {
    constructor(
        private configService: ConfigService,
        private blockchainProvider: BlockchainProvider,
    ) {}

    async onModuleInit() {
        const rpc = this.configService.get<string>('RPC_URL');
        const address = this.configService.get<string>('CONTRACT_ADDRESS') as string;

        const provider = new ethers.JsonRpcProvider(rpc);
        const contract = new Contract(address, ContractAbi.abi, provider);


        contract.on('ProposalCreated', async (
            proposalId: string, 
            proposer: string, 
            targets: string[], 
            values: BigInt[],
            argss: string[],
            calldatas: any,
            snapshot: BigInt,
            duration: BigInt,
            description: string
        ) => {

            const startBlock = Number(snapshot);
            const currentBlock = await provider.getBlockNumber();
            
            const seconds = (startBlock - currentBlock) * 12; 

            this.blockchainProvider.registerProposal(
                proposalId,
                proposer,
                description,
                seconds
            );
        });
    }
}

