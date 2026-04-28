import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('proposals')
export class ProposalEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    proposalId: string;

    @Column()
    description: string;

    @Column()
    proposer: string;

    @Column()
    executed: boolean;

    @Column()
    seconds: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
