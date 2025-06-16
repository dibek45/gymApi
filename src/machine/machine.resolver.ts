import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MachineService } from './machine.service';
import { Machine } from './entities/machine.entity';
import { CreateMachineInput } from './dto/create-machine.input';
import { UpdateMachineInput } from './dto/update-machine.input';

@Resolver(() => Machine)
export class MachineResolver {
  constructor(private readonly machineService: MachineService) {}

  @Mutation(() => Machine)
  createMachine(@Args('createMachineInput') createMachineInput: CreateMachineInput) {
    return this.machineService.create(createMachineInput);
  }

  @Query(() => [Machine], { name: 'machinesByGym' })
  findAllByGym(@Args('gymId', { type: () => Int }) gymId: number) {
    return this.machineService.findAllByGym(gymId);
  }
  
  @Query(() => Machine, { name: 'machine' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.machineService.findOne(id);
  }

  @Mutation(() => Machine)
updateMachine(
  @Args('updateMachineInput') updateMachineInput: UpdateMachineInput,
) {
  return this.machineService.update(updateMachineInput.id, updateMachineInput);
}

  @Mutation(() => Machine)
  removeMachine(@Args('id', { type: () => Int }) id: number) {
    return this.machineService.remove(id);
  }
}
