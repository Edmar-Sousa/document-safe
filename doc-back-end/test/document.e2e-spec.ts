import request from "supertest";

import { Test } from '@nestjs/testing';
import { Repository } from "typeorm";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity } from '@/entities/user.entity';
import { DocumentEntity } from '@/entities/documents.entity';

import { HandlerExceptions } from '@/filters/exceptions/handler.exceptions';
import { DocumentModule } from "@/modules/document/document.module";
import { JwtStrategy } from "@/modules/auth/jwt.strategy";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { MockAuthGuard } from "./mocks/MockAuthGuard";

let userRepository: Repository<UserEntity>;

describe('Document Controller (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            providers: [
                JwtStrategy,
            ],
            imports: [
                ConfigModule.forRoot({ 
                    isGlobal: true,
                    load: [() => ({
                        JWT_SECRET: 'test_secret',
                    })],
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [UserEntity, DocumentEntity],
                    dropSchema: true,
                    synchronize: true,
                }),
                DocumentModule,
            ],
        })
        .overrideGuard(JwtAuthGuard)
        .useClass(MockAuthGuard)
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HandlerExceptions());
        await app.init();

        userRepository = moduleFixture.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity),
        );

        await userRepository.save({
            id: 1,
            email: 'test@test.com',
            name: 'Test User',
            password: '123456',
        });
    });
    
    afterAll(async () => await app.close());


    it('POST /documents - Test create document', async () => {
        const documentData = {
            title: 'Test Document',
            mimeType: 'application/pdf',
            size: 1024,
            url: 'http://example.com/document.pdf',
            hash: 'abc123',
        };

        const response = await request(app.getHttpServer())
            .post('/documents')
            .send(documentData)
            .expect(201);

        expect(response.body.mimeType).toBe(documentData.mimeType);
    });

    it('GET /documents - Test get documents', async () => {
        const response = await request(app.getHttpServer())
            .get('/documents')
            .expect(200);

        expect(response.body.page).toBe(1);
        expect(response.body.total).toBe(1);
        expect(response.body.data[0].id).toBe(1);
        expect(response.body.data[0].mimeType).toBe('application/pdf');
    });

    it('GET /documents/1 - Test get documents', async () => {
        const response = await request(app.getHttpServer())
            .get('/documents/1')
            .expect(200);

        expect(response.body.id).toBe(1);
        expect(response.body.mimeType).toBe('application/pdf');
    });

    it('GET /documents/2 - Test get documents', async () => {
        const response = await request(app.getHttpServer())
            .get('/documents/2')
            .expect(404);

        expect(response.body.id).toBe('DOCUMENT_NOT_FOUND');
    });

    it('DELETE /documents/1 - Test delete document', async () => {
        await request(app.getHttpServer())
            .delete('/documents/1')
            .expect(200);

        const response = await request(app.getHttpServer())
            .get('/documents/1')
            .expect(404);
            
        expect(response.body.id).toBe('DOCUMENT_NOT_FOUND');
    });

    it('DELETE /documents/2 - Test delete non-existent document', async () => {
        const response = await request(app.getHttpServer())
            .delete('/documents/2')
            .expect(404);
            
        expect(response.body.id).toBe('DOCUMENT_NOT_FOUND');
    });
});

