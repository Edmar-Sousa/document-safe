import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthProvider } from "./auth.provider";

import { JwtStrategy } from "./jwt.strategy";
import { UserEntity } from "@/entities/user.entity";
import { DocumentEntity } from "@/entities/documents.entity";


@Module({
    controllers: [
        AuthController,
    ],
    providers: [
        AuthProvider, 
        JwtModule,
        JwtStrategy,
    ],
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([
            UserEntity,
            DocumentEntity,
        ]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { 
                    expiresIn: '1h'
                },
            }),
        }),
    ],
})
export class AuthModule {}
