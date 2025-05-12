import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';

  import { Server, Socket } from 'socket.io';
import { CashRegister } from './point-of-sale/entities/cash-register.entity';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class AppGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger(AppGateway.name); // ✅ <--- esto es lo que falta

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
@SubscribeMessage('joinRoom')
handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
  client.join(room);
  this.logger.log(`Cliente unido a la sala: ${room}`);
}

  }
  
  