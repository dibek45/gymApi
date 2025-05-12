import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { CashRegisterService } from '../services/cash-register.service';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';
import { UpdateVersionService } from 'src/update-version/update-version.service';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';
import { AppGateway } from 'src/app.gateway';

@Resolver(() => CashRegister)
export class CashRegisterResolver {
  constructor(
    private readonly cashRegisterService: CashRegisterService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly updateVersionService: UpdateVersionService,
    private gateway:AppGateway

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
  @AutoTouchVersion('cashRegisters')
  async createCashRegister(
    @Args('input') input: CreateCashRegisterInput,
  ): Promise<CashRegister> {
    const newRegister = await this.cashRegisterService.create(input);
  
    const gymIdFinal = newRegister.gym?.id ?? newRegister.gymId;
  /*
    console.log('📣 Publicando cashRegisterUpdated:', {
      id: newRegister.id,
      gymId: gymIdFinal,
    });
  
    await this.pubSub.publish('cashRegisterUpdated', {
      cashRegisterUpdated: {
        ...newRegister,
        gymId: gymIdFinal,
      },
    });
  */
    // ✅ Este return asegura que el interceptor lo detecte
    console.log('📦 Devolviendo desde la mutación:', {
      ...newRegister,
      gymId: gymIdFinal,
    });
this.gateway.server.emit('cashRegisterUpdated', {
  ...newRegister,
  gymId: gymIdFinal
});

    return {
      ...newRegister,
      gymId: gymIdFinal,
    };
  }
  












/*

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
  }*/
}
