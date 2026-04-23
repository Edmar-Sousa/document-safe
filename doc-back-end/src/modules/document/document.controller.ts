import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Session } from "@/decorators/session.decorator";
import { DocumentProvider } from "./document.provider";
import { CreateDocumentDto } from "./dto/create-document.dto";

import { type SessionType } from "@/types/session";


@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {

    constructor (private readonly documentProvider: DocumentProvider) {}


    @Post()
    async createDocument(
        @Body() body: CreateDocumentDto,
        @Session() session: SessionType,
    ) {
        return this.documentProvider.createDocument(body, session);
    }

    @Get()
    async getDocuments(
        @Session() session: SessionType,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.documentProvider.getDocumentsByOwnerId(session.sub, page, limit);
    }

    @Get(':id')
    async getDocument(
        @Session() session: SessionType,
        @Param('id') id: number,
    ) {
        return this.documentProvider.getDocumentWithId(session.sub, id);
    }

    @Delete(':id')
    async deleteDocument(
        @Session() session: SessionType,
        @Param('id') id: number,
    ) {
        return this.documentProvider.deleteDocument(session.sub, id);
    }

}