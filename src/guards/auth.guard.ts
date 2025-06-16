import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se encontró un token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const response = await this.client.send('validate_token', token).toPromise();

      if (!response.valid) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = response.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Error de autenticación');
    }
  }
}
