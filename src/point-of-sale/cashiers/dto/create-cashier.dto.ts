import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEmail, MinLength, IsNumber } from 'class-validator';

@InputType()
export class CreateCashierDto {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field(() => Int)
  @IsNotEmpty()
  gymId: number;

  @Field({ nullable: true }) // 👈 Esto lo hace opcional
  
  @IsOptional()
  @IsNumber()
  userId?: number;
}
