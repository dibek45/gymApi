import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 🔹 Obtiene los permisos requeridos desde @SetMetadata
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    if (!requiredPermissions) {
      return true; // ✅ Si no hay permisos requeridos, deja pasar
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // ⚠️ Asegúrate de que `user` tenga permisos cargados en el JWT

    // 🔹 Verifica si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = user.permissions.some(permission => requiredPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
