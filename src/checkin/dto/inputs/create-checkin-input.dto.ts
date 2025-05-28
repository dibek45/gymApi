import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

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

  // ✅ Campo que falta
  @Field()
  @IsString()
  @IsNotEmpty()
  checkinDate: string;
}
