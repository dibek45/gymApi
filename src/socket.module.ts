// socket.module.ts
import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Module({
  providers: [AppGateway],
  exports: [AppGateway], // <-- Necesario para usarlo fuera de este módulo
})
export class SocketModule {}
