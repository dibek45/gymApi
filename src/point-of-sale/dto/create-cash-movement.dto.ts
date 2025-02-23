import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCashMovementInput {
  @Field(() => Number)
  cashId: number; // Relación con la caja

  @Field(() => String)
  type: string; // Tipo de movimiento: 'sale', 'deposit', 'withdrawal', etc.

  @Field(() => Number)
  amount: number; // Monto del movimiento (positivo para ingresos, negativo para egresos)

  @Field(() => String, { nullable: true })
  concept?: string; // Descripción opcional del movimiento

  @Field(() => Number)
  userId: number; // Usuario que realiza el movimiento
}
