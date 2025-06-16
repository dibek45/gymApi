import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class CreateCashRegisterInput {
  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  cashierId: number; // ID del cajero

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  openingBalance: number; // Balance inicial de la caja

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  gymId: number; // ID del gimnasio
}
