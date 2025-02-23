import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CashRegisterService } from '../services/cash-register.service';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';

@Resolver(() => CashRegister)
export class CashRegisterResolver {
  constructor(private readonly cashRegisterService: CashRegisterService) {}

  @Query(() => [CashRegister])
  async getAllCashRegisters(
    @Args('gymId', { type: () => Int, nullable: true }) gymId?: number,
  ): Promise<CashRegister[]> {
    if (gymId) {
      return this.cashRegisterService.findByGym(gymId);
    }
    return this.cashRegisterService.findAll();
  }

  @Query(() => CashRegister)
  async getCashRegister(@Args('id') id: number): Promise<CashRegister> {
    return this.cashRegisterService.findOne(id);
  }

  @Mutation(() => CashRegister)
  async createCashRegister(
    @Args('input') input: CreateCashRegisterInput,
  ): Promise<CashRegister> {
    return this.cashRegisterService.create(input);
  }
}
