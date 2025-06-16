import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
  IsDate,
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

  @Field(() => Date)
  @IsDate()
  expenseDate: Date;


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


    @Field({ nullable: true })
      @IsNumber()
    cashRegisterId?: number;
}
