import request from "supertest";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";


import { AuthModule } from "@/modules/auth/auth.module";
import { UserEntity } from "@/entities/user.entity";
import { DocumentEntity } from "@/entities/documents.entity";
import { HandlerExceptions } from "@/filters/exceptions/handler.exceptions";



describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
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
                AuthModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HandlerExceptions());
        await app.init();
    });

    afterAll(async () => await app.close());

    it('POST /auth/sign-up - Test create user', async () => {
        const user = {
            name: "Test Unit",
            email: "test@example.com",
            password: "12345678",
        };

        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(user)
            .expect(201);

        expect(response.body.name).toBe(user.name);
    });

    it('POST /auth/sign-in - Test sign in user', async () => {
        const user = {
            email: "test@example.com",
            password: "12345678",
        };


        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(user)
            .expect(200);

        expect(response.body.data).toHaveProperty('accessToken');
    });

    it('POST /auth/sign-in - Test sign in user does not exist', async () => {
        const user = {
            email: "nonexistent@example.com",
            password: "12345678",
        };


        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(user)
            .expect(404);

        expect(response.body.id).toBe('USER_NOT_FOUND');
    });

    it('POST /auth/sign-in - Test sign in with invalid credentials', async () => {
        const user = {
            email: "test@example.com",
            password: "wrongpassword",
        };


        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(user)
            .expect(400);

        expect(response.body.id).toBe('USER_PASSWORD_INCORRECT');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveProperty('password');
    });
});
