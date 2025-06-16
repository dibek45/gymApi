import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

@InputType()
export class UpdateRoutine {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  link?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  path?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  count?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;


  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  exerciseTypeId?: number; // Permitir actualizar el tipo de ejercicio
}
