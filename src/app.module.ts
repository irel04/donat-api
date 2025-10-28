import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>("MYSQLHOST"),
        port: parseInt(configService.get<string>("MYSQLPORT")!, 10),
        username: configService.get<string>("MYSQLUSER"),
        password: configService.get<string>("MYSQLPASSWORD"),
        database: configService.get<string>("MYSQLDATABASE"),
        entities: [],
        autoLoadEntities: true,
        // synchronize: true,
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    CloudinaryModule,
  ],
})
export class AppModule { }
