import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CashiersService } from './cashiers.service';
import { Cashier } from './entities/cashier.entity';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';
import { AppGateway } from 'src/app.gateway';

@Resolver(() => Cashier)
export class CashiersResolver {
  constructor(private readonly cashiersService: CashiersService,  private readonly socketGateway: AppGateway
) {}

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
  @AutoTouchVersion('cashiers')
  @Mutation(() => Cashier)
  async createCashier(@Args('createCashierInput') createCashierInput: CreateCashierDto) {
    console.log("-------------------------------------------------------------------------------wwwss")
  const newCashier = await this.cashiersService.create(createCashierInput);
  this.socketGateway.emitCashierUpdate(newCashier); // ✅ ya es un Cashier
  return newCashier;
  }

  // Actualizar un cajero existente
@AutoTouchVersion('cashiers')
@Mutation(() => Cashier)
async updateCashier(
  @Args('updateCashierInput') updateCashierInput: UpdateCashierDto
): Promise<Cashier> {
  const updated = await this.cashiersService.update(updateCashierInput.id, updateCashierInput);

  this.socketGateway.emitCashierUpdate(updated); // ✅ Aquí se emite ya con el objeto completo
  return updated;
}



@Mutation(() => Boolean)
@AutoTouchVersion('cashiers')
async removeCashier(@Args('id', { type: () => Int }) id: number) {
  const { gymId } = await this.cashiersService.remove(id);
  this.socketGateway.emitCashierDeleted(id, gymId);
  return true;
}

}
