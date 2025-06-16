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
import { Product } from './product/product.entity';
import { Cashier } from './point-of-sale/cashiers/entities/cashier.entity';
  
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
        const room = `gym-${updatedCashRegister.gymId}`;
        this.logger.log(`📤 Enviando cashRegisterUpdated a sala: ${room}`);
        this.server.to(room).emit('cashRegisterUpdated', updatedCashRegister);
  }



@SubscribeMessage('joinGym')
handleJoinGym(@MessageBody() gymId: string | number, @ConnectedSocket() client: Socket) {
  this.logger.log(`📥 joinGym recibido con: ${JSON.stringify(gymId)}`);

  const room = typeof gymId === 'string' && gymId.startsWith('gym-')
    ? gymId
    : `gym-${gymId}`;

  client.join(room);
  this.logger.log(`✅ Cliente unido a la sala: ${room}`);
}



  emitMemberUpdate(member: any) {
  const room = `gym-${member.gymId}`;
  this.logger.log(`📤 Enviando memberUpdated a sala: ${room}`);
  this.server.to(room).emit('memberUpdated', member);
}


//aaa

  // ✅ Producto actualizado
  emitProductUpdate(product: Product) {
    const room = `gym-${product.gymId}`;
    this.logger.log(`📤 Enviando productUpdated a sala: ${room}`);
    this.server.to(room).emit('productUpdated', product);
  }


  emitCashierUpdate(updated: Cashier) {
  this.server.to(`gym-${updated.gymId}`).emit('cashierUpdated', updated);
}

// app.gateway.ts
emitCashierDeleted(cashierId: number, gymId: number) {
  this.server.to(`gym-${gymId}`).emit('cashierDeleted', { id: cashierId });
}


emitCheckinUpdate(checkin: any) {
  const room = `gym-${checkin.gymId}`;
  this.logger.log(`📤 Enviando checkinUpdated a sala: ${room}`);
  this.server.to(room).emit('checkinUpdated', checkin);
}

@SubscribeMessage('newCheckin')
handleNewCheckin(@MessageBody() checkin: any) {
  const room = `gym-${checkin.gymId}`;
  this.logger.log(`🟢 Checkin recibido por socket para gym ${room}:`, checkin);
  this.server.to(room).emit('checkinUpdated', checkin);
}

emitExpenseUpdate(expense: any) {
  const room = `gym-${expense.gymId}`;
  this.logger.log(`📤 Enviando expenseUpdated a sala: ${room}`);
  this.server.to(room).emit('expenseUpdated', expense);
}


emitExpenseDeleted(expenseId: number, gymId: number) {
  this.server.to(`gym-${gymId}`).emit('expenseDeleted', { id: expenseId });
}


@SubscribeMessage('newExpense')
handleNewExpense(@MessageBody() expense: any) {
  const room = `gym-${expense.gymId}`;
  this.logger.log(`🟢 Gasto recibido por socket para gym ${room}:`, expense);
  this.server.to(room).emit('expenseUpdated', expense);
}

emitCashRegisterUpdate(cashRegister: CashRegister) {
  const room = `gym-${cashRegister.gymId}`;
  this.logger.log(`📤 Enviando cashRegisterUpdated a sala: ${room}`);
  this.server.to(room).emit('cashRegisterUpdated', cashRegister);
}


emitSaleUpdate(sale: any) {
  const room = `gym-${sale.gymId}`;
  this.logger.log(`📤 Enviando saleUpdated a sala: ${room}`);
  this.server.to(room).emit('saleUpdated', sale);
}

  }
  
  