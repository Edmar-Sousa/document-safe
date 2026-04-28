import { Module } from "@nestjs/common";
import { BlockchainProposalListener } from "./proposal";
import { BlockchainProvider } from "./blockchain.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProposalEntity } from "@/entities/proposals.entity";
import { BlockchainController } from "./blockchain.controller";


@Module({
    controllers: [
        BlockchainController,
    ],
    providers: [
        BlockchainProvider,
        BlockchainProposalListener,
    ],
    imports: [
        TypeOrmModule.forFeature([
            ProposalEntity,
        ]),
    ],
})
export class BlockchainModule {}
