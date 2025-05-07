import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { CashRegisterService } from '../services/cash-register.service';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => CashRegister)
export class CashRegisterResolver {
  constructor(private readonly cashRegisterService: CashRegisterService) {}
  private pubSub = new PubSub(); // ✅ Así se declara correctamente

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


  @Subscription(() => CashRegister, {
    filter: (payload, variables) => payload.cashRegisterUpdated.gymId === variables.gymId,
  })
  cashRegisterUpdated2(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.pubSub.asyncIterator('cashRegisterUpdated');
  }
  


  @Query(() => Boolean)
  async testCashRegisterUpdate2(): Promise<boolean> {
    await this.pubSub.publish('cashRegisterUpdated', {
      cashRegisterUpdated: {
        id: 1,
        currentBalance: 100,
        gymId: 1,
      },
    });
    return true;
  }

  // tu suscripción debería verse así:
  @Subscription(() => CashRegister, {
    name: 'cashRegisterUpdated',
    filter: (payload, variables) => payload.cashRegisterUpdated.gymId === variables.gymId,
  })
  cashRegisterUpdated(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.pubSub.asyncIterator('cashRegisterUpdated');
  }
}
