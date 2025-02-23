import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,@Inject('AUTH_MEMBER_SERVICE') private readonly authClientMember: ClientProxy) {}

  async login(email: string, password: string) {
    console.log('📤 Enviando mensaje a auth-service2...', { email, password });

    try {

      const response = await firstValueFrom(this.authClient.send('auth.login', { email, password }));
      
      console.log('📥 Respuesta recibida desde auth-service2:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al conectar con auth-service2:', error);
      throw error;
    }
  }


  async loginMember(email: string, password: string) {
    console.log('📤 Enviando mensaje a member...', { email, password });

    try {

      const response = await firstValueFrom(this.authClientMember.send('auth.login.user', { email, password }));
      
      console.log('📥 Respuesta recibida desde auth-service2:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al conectar con auth-service2:', error);
      throw error;
    }
  }
}
