import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SessionType } from "@/types/session";
import { DocumentEntity } from "@/entities/documents.entity";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { CreateDocumentException } from "./exceptions/CreateDocumentException";
import { paginate } from "@/helpers/pagination";
import { DocumentNotFoundException } from "./exceptions/DocumentNotFountException";

@Injectable()
export class DocumentProvider {
    constructor(
        @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>
    ) {

    }

    async createDocument(body: CreateDocumentDto, session: SessionType) {
        try {
            const document = this.documentRepository.create({
                title: body.title,
                mimeType: body.mimeType,
                size: body.size,
                url: body.url,
                hash: body.hash,
                ownerId: session.sub,
            });
    
            return await this.documentRepository.save(document);
        } 
        
        catch (error) {
            throw new CreateDocumentException({
                message: 'Erro ao registrar documento no banco de dados',
            });
        }
    }


    async getDocumentsByOwnerId(ownerId: number, page: number, limit: number) {
        const doc = this.documentRepository
            .createQueryBuilder()
            .where('ownerId = :ownerId', { ownerId })
            .orderBy('createdAt', 'DESC');

        return paginate(doc, page, limit);
    }

    async getDocumentWithId(ownerId: number, id: number) {
        const document = await this.documentRepository.findOne({
            where: {
                id,
                ownerId,
            },
        });
        
        if (!document) {
            throw new DocumentNotFoundException({
                message: 'Documento não encontrado',
            });
        }

        return document;
    }

    async deleteDocument(ownerId: number, id: number) {
        const document = await this.documentRepository.findOne({
            where: {
                id,
                ownerId,
            },
        });
        
        if (!document) {
            throw new DocumentNotFoundException({
                message: 'Documento não encontrado',
            });
        }

        await this.documentRepository.delete(id);
    }
}
