import { Field, InputType, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class CreateCheckinInput {
  @Field(() => Int)
  @IsNumber()
  memberId: number;

  @Field(() => Int)
  @IsNumber()
  gymId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  timestamp: string; // ISO string

  @Field()
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tempId?: string;
}
