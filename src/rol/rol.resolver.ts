import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto';
import { AssignPermissionsInput } from './dto/inputs/assign-permissions.input';
import { RolesResponse } from './roles.response';


@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role, { name: 'createRole' }) // Nombre explícito para GraphQL
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    console.log(createRoleInput)
    return this.rolesService.create(createRoleInput);
  }

  @Mutation(() => Role, { name: 'assignPermissions' }) // Nombre explícito para GraphQL
  assignPermissions(@Args('assignPermissionsInput') assignPermissionsInput: AssignPermissionsInput) {
    return this.rolesService.assignPermissions(assignPermissionsInput);
  }

  @Query(() => RolesResponse, { name: 'rolesnew' }) // ✅ Ahora devuelve `roles` y `allPermissions`
  async findAllRoles(): Promise<RolesResponse> {
    return this.rolesService.findAll();
  }
}
