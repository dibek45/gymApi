import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsString()
  @MaxLength(200)
  description: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  paymentMethod: string;

  @Field()
  @IsDateString()
  expenseDate: string;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsString()
  createdBy: string;

  @Field(() => Int)
  @IsNumber()
  cashierId: number;

  @Field(() => Int)
  @IsNumber()
  gymId: number;
}
