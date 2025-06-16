import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
@Injectable()
@WebSocketGateway()
export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private clients: Map<string, Socket> = new Map(); // Usamos un Map para almacenar clientes con IDs

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const clientId = client.handshake.query.clientId as string || client.id;
        
    console.log(`Client connected id: ${clientId}`);
    this.clients.set(clientId, client); // Almacenamos el cliente en el Map con su ID
  }

  handleDisconnect(client: Socket) {
    // Buscamos el cliente en el Map y obtenemos su ID
    const clientId = Array.from(this.clients.entries())
                         .find(([key, socket]) => socket === client)?.[0];

    if (clientId) {
      console.log(`Client disconnected id: ${clientId}`);
      this.clients.delete(clientId); // Eliminamos al cliente del Map al desconectarse
    }
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {
    const serverEventString = JSON.stringify(payload);    
    console.log(`Message from client ${client.id}: ${serverEventString}`);
    this.server.emit('messageToClient', serverEventString);
  }

}
