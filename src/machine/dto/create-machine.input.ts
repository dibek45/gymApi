import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray, MaxLength } from 'class-validator';
import { CreateQrInput } from './create-qr.input';

@InputType()
export class CreateMachineInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsNotEmpty()
  gymId: number;

  @Field(() => [CreateQrInput], { nullable: true })
  @IsOptional()
  @IsArray()
  qrs?: CreateQrInput[];
}
