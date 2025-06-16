import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './gateway';

@Module({})
export class SocketModule {
    
  
  providers: [ WebsocketsGateway]

}
