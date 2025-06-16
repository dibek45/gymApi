import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

@InputType()
export class UpdateExpenseInput {
  @Field(() => Number, { description: 'ID', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field(() => String, { description: 'Description', nullable: true })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @Field(() => Date)
@IsDate()
  @IsOptional()
  expenseDate?: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  cashierId?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  gymId?: number;

  
    @Field({ nullable: true })
      @IsNumber()
    cashRegisterId?: number;
}
