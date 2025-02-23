import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/inputs/create-permission.input';
import { UpdatePermissionInput } from './dto/inputs/update-permission.input';
import { SetMetadata } from '@nestjs/common';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => Permission, { name: 'createPermission' }) // Nombre explícito para GraphQL
  createPermission(@Args('createPermissionInput') createPermissionInput: CreatePermissionInput) {
    return this.permissionsService.create(createPermissionInput);
  }

  @Query(() => [Permission], { name: 'permissions' }) // Nombre explícito para GraphQL
  findAllPermissions() {
    return this.permissionsService.findAll();
  }

  @Mutation(() => Permission, { name: 'updatePermission' })
  updatePermission(@Args('updatePermissionInput') updatePermissionInput: UpdatePermissionInput) {
    return this.permissionsService.update(updatePermissionInput);
  }

  @Mutation(() => Boolean, { name: 'deletePermission' })
  @SetMetadata('permissions', ['manage_permissions'])
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.permissionsService.remove(id);
  }
  
}
