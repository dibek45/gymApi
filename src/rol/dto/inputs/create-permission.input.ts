import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  gymId: number;

  @Field()
  category: string; // ✅ New field to categorize permissions
}
