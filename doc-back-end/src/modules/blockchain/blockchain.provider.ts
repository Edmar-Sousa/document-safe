import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateProposalException } from "./exceptions/CreateProposalException";
import { ProposalEntity } from "@/entities/proposals.entity";
import { paginate } from "@/helpers/pagination";


@Injectable()
export class BlockchainProvider {

    constructor(
        @InjectRepository(ProposalEntity) private proposalRepository: Repository<ProposalEntity>,
    ) {}

    async registerProposal(proposalId: string, proposer: string, description: string, seconds: number) {
        
        try {
            const proposal = this.proposalRepository.create({
                proposalId,
                description,
                proposer,
                seconds,
                executed: false,
            });

            return await this.proposalRepository.save(proposal);
        }

        catch (error) {
            throw new CreateProposalException({
                message: 'Erro ao registrar proposta',
            })
        }

    }


    async getProposals(page: number = 1, limit: number = 10) {
        const prop = this.proposalRepository.createQueryBuilder();
        return paginate(prop, page, limit);
    }
}
