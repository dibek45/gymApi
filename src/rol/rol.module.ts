import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { RolesResolver } from './rol.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [
    RolesService,
    RolesResolver,
    PermissionsService,
    PermissionsResolver,
  ],
  exports: [RolesService, PermissionsService],
})
export class RolesModule {}
