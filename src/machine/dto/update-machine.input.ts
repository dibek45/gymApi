import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateQrInput } from './create-qr.input';

@InputType()
export class UpdateMachineInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsInt()
  gymId: number;

  @Field(() => [CreateQrInput], { nullable: true })
  @IsOptional()
  qrs?: CreateQrInput[];
}
