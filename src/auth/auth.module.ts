import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'auth-service2',
          port: parseInt(process.env.AUTH_SERVICE_PORT, 10) || 4001, // Asegúrate de que sea 4001
        },
      },
      {
        name: 'AUTH_MEMBER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'authmember2',
          port: 4002, // Asegúrate de que sea 4001
        },
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}