import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { DocumentEntity } from "./documents.entity";


@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Unique(['email'])
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => DocumentEntity, document => document.ownerId)
    documents: DocumentEntity[];
}
