import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

@InputType()
export class CreateRoutine {
  @Field(() => String)
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  link: string; 

  @Field(() => String)
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  path: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(255)
  description?: string;



  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  exerciseTypeId: number; // Relación obligatoria con el tipo de ejercicio
}
