import { Column, CreateDateColumn, Entity, ForeignKey, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity('documents')
export class DocumentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    mimeType: string;

    @Column()
    size: number;

    @Column()
    url: string;

    @Column()
    hash: string;

    @Column()
    ownerId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity, user => user.documents, { onDelete: 'CASCADE' })
    owner: UserEntity;
}