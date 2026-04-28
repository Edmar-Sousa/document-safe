import { Controller, Get, Query } from "@nestjs/common";
import { BlockchainProvider } from "./blockchain.provider";


@Controller('/blockchain')
export class BlockchainController {

    constructor (
        private blockchainProvider: BlockchainProvider,
    ) {}


    @Get('/proposals')
    async getProposals(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.blockchainProvider.getProposals(page, limit);
    }

}
