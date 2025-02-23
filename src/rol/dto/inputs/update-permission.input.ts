import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt } from 'class-validator';

@InputType()
export class UpdatePermissionInput {
  @Field(() => Int)
  @IsInt()
  id: number; // Identificador del permiso que se actualizará

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  category: string; 
}
