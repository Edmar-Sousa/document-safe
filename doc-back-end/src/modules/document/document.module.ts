import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentProvider } from "./document.provider";
import { DocumentController } from "./document.controller";

import { UserEntity } from "@/entities/user.entity";
import { DocumentEntity } from "@/entities/documents.entity";

@Module({
    controllers: [
        DocumentController
    ],
    providers: [
        DocumentProvider,
    ],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            DocumentEntity,
        ]),
    ],
})
export class DocumentModule {}
