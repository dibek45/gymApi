import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class UpdateCheckinInput {
  @Field(() => Int, { description: 'ID', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  memberId?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  gymId?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  timestamp?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  tempId?: string;
}
