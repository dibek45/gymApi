import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MachineService } from './machine.service';
import { Machine } from './entities/machine.entity';
import { CreateMachineInput } from './dto/create-machine.input';
import { UpdateMachineInput } from './dto/update-machine.input';
import { AppGateway } from 'src/app.gateway';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';

@Resolver(() => Machine)
export class MachineResolver {
  constructor(
    private readonly machineService: MachineService,
    private readonly _socketService: AppGateway,
  ) {}

  @AutoTouchVersion('machines')
  @Mutation(() => Machine)
  async createMachine(
    @Args('createMachineInput') createMachineInput: CreateMachineInput,
  ): Promise<Machine> {
    const created = await this.machineService.create(createMachineInput);
    this._socketService.emitMachineUpdate(created);
    return created;
  }

  @Query(() => [Machine], { name: 'machinesByGym' })
  findAllByGym(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.machineService.findAllByGym(gymId);
  }

  @Query(() => Machine, { name: 'machine' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.machineService.findOne(id);
  }

  @AutoTouchVersion('machines')
  @Mutation(() => Machine)
  async updateMachine(
    @Args('updateMachineInput') updateMachineInput: UpdateMachineInput,
  ): Promise<Machine> {
    const updated = await this.machineService.update(
      updateMachineInput.id,
      updateMachineInput,
    );
    this._socketService.emitMachineUpdate(updated);
    return updated;
  }

  @AutoTouchVersion('machines')
  @Mutation(() => Boolean)
  async removeMachine(@Args('id', { type: () => Int }) id: number) {
    return this.machineService.remove(id);
  }
}
