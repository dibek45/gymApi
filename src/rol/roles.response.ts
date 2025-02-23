import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';


@ObjectType()
export class RolesResponse {
  @Field(() => [Role])
  roles: Role[];

  @Field(() => [Permission])
  allPermissions: Permission[];
}
