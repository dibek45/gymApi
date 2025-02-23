import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CashiersService } from './cashiers.service';
import { Cashier } from './entities/cashier.entity';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';

@Resolver(() => Cashier)
export class CashiersResolver {
  constructor(private readonly cashiersService: CashiersService) {}

  // Obtener todos los cajeros
  @Query(() => [Cashier], { name: 'cashiers' })
  findAll(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.cashiersService.findAll(gymId);
  }

  // Obtener un cajero por ID
  @Query(() => Cashier, { name: 'cashier' })
  findOne(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.cashiersService.findOne(gymId);
  }

  // Crear un nuevo cajero
  @Mutation(() => Cashier)
  createCashier(@Args('createCashierInput') createCashierInput: CreateCashierDto) {
    return this.cashiersService.create(createCashierInput);
  }

  // Actualizar un cajero existente
  @Mutation(() => Cashier)
updateCashier(@Args('updateCashierInput') updateCashierInput: UpdateCashierDto): Promise<Cashier> {
  return this.cashiersService.update(updateCashierInput.id, updateCashierInput);
}


  // Eliminar un cajero por ID
  @Mutation(() => Boolean)
  removeCashier(@Args('id', { type: () => Int }) id: number) {
    return this.cashiersService.remove(id).then(() => true);
  }
}
