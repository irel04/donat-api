import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('MYSECRET'),
        signOptions: { expiresIn: '60s' }, // Adjust the expiration time as needed
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
