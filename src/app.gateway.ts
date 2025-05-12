import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
import { CashRegister } from './point-of-sale/entities/cash-register.entity';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class AppGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`🟢 Cliente conectado: ${client.id}`);
      this.server.emit('pong', `Nuevo cliente conectado: ${client.id}`);
    }
  
    @SubscribeMessage('ping')
    handlePing(@MessageBody() data: string) {
      console.log('Mensaje recibido:', data);
      this.server.emit('pong', `pong: ${data}`);
    }


    @SubscribeMessage('updateCashRegister')
      handleUpdateCashRegister(@MessageBody() updatedCashRegister: CashRegister) {
        console.log('📦 Caja actualizada recibida:', updatedCashRegister);
        // 🔁 Emitir a todos los clientes conectados
        this.server.emit('cashRegisterUpdated', updatedCashRegister);
  }

  }
  
  