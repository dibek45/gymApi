import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UpdateVersion {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  gym_id: number;

  @Field()
  table_name: string;

  @Field()
  updated_at: Date;
}
