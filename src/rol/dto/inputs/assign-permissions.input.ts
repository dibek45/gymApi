import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AssignPermissionsInput {
  @Field(() => Int)
  roleId: number;

  @Field(() => [Int])
  permissionIds: number[];
}
