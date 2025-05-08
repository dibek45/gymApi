import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { CashRegisterService } from '../services/cash-register.service';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';

@Resolver(() => CashRegister)
export class CashRegisterResolver {
  constructor(
    private readonly cashRegisterService: CashRegisterService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

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
    const newRegister = await this.cashRegisterService.create(input);

    console.log('📣 Publicando cashRegisterUpdated:', {
      id: newRegister.id,
      gymId: newRegister.gym?.id ?? newRegister.gymId,
    });
    await this.pubSub.publish('cashRegisterUpdated', {
      cashRegisterUpdated: {
        ...newRegister,
        gymId: newRegister.gym?.id ?? newRegister.gymId, // asegúrate que exista gymId directo
      },
    });
    

    return newRegister;
  }

  @Subscription(() => CashRegister, {
    filter: (payload, variables) => {
      console.log('📡 FILTRO', payload.cashRegisterUpdated);
      return payload.cashRegisterUpdated.gymId === variables.gymId;
    },    
  })
  cashRegisterUpdated(
    @Args('gymId', { type: () => Int }) gymId: number,
  ) {
    return this.pubSub.asyncIterator('cashRegisterUpdated');
  }
}
