import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCashierDto } from './create-cashier.dto';

@InputType()
export class UpdateCashierDto extends PartialType(CreateCashierDto) {
  @Field(() => Int)
  id: number; // Campo obligatorio para identificar el cajero a actualizar
}