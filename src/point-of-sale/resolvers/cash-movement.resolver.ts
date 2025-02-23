import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CashMovementService } from '../services/cash-movement.service';
import { CashRegisterService } from '../services/cash-register.service';
import { CashMovement } from '../entities/cash-movement.entity';
import { CreateCashMovementInput } from '../dto/create-cash-movement.dto';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';

@Resolver(() => CashMovement)
export class CashMovementResolver {
  constructor(
    private readonly cashMovementService: CashMovementService,
    private readonly cashRegisterService: CashRegisterService, // Para actualizar el saldo
  ) {}

  // Consulta movimientos por caja
  @Query(() => [CashMovement])
  async getMovementsByCashRegister(
    @Args('cashId') cashId: number,
  ): Promise<CashMovement[]> {
    return this.cashMovementService.findByCashId(cashId);
  }

  // Registrar un nuevo movimiento
  @Mutation(() => CashRegister)
  async createCashRegister(
    @Args('input') input: CreateCashRegisterInput,
  ): Promise<CashRegister> {
    return this.cashRegisterService.create(input);
  }
}

