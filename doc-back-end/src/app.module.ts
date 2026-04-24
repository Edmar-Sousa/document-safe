import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { 
  ConfigModule, 
  ConfigService 
} from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),

    }),

    AuthModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
