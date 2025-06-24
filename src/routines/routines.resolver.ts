import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoutineService } from './routines.service';
import { CreateRoutine } from './dto/inputs/create-routines-input.dto';
import { UpdateRoutine } from './dto/inputs/update-routines.input.dto';
import { Routine } from './routines.entity';
import { ExerciseType } from './exercise-type.entity';
import { ExerciseTypeService } from './exercise-type-service';
import { AppGateway } from 'src/app.gateway';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';

@Resolver(() => Routine)
export class RoutineResolver {
  constructor(
    private readonly routineService: RoutineService,
    private exerciseTypeService: ExerciseTypeService,
    private readonly _socketService: AppGateway,
  ) {}

  @Query(() => [ExerciseType])
  async exerciseTypesByGym(@Args('gymId') gymId: number): Promise<ExerciseType[]> {
    return this.exerciseTypeService.findAll(gymId);
  }

  @Query(() => [Routine], { name: 'routines' })
  async findAll(
    @Args('exerciseTypeId', { type: () => Int, nullable: true }) exerciseTypeId?: number,
    @Args('gymId', { type: () => Int, nullable: true }) gymId?: number,
  ): Promise<Routine[]> {
    return this.routineService.findAll(exerciseTypeId, gymId);
  }

  @Query(() => Routine, { name: 'routine' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Routine> {
    return this.routineService.findOne(id);
  }

  @AutoTouchVersion('routines')
  @Mutation(() => Routine, { name: 'createRoutine' })
  async create(@Args('createRoutine') createRoutine: CreateRoutine): Promise<Routine> {
    const created = await this.routineService.create(createRoutine);
    this._socketService.emitRoutineUpdate(created); // 🔥 Emitimos evento WebSocket
    return created;
  }

  @AutoTouchVersion('routines')
  @Mutation(() => Routine, { name: 'updateRoutine' })
  async update(@Args('updateRoutine') updateRoutine: UpdateRoutine): Promise<Routine> {
    const updated = await this.routineService.update(updateRoutine.id, updateRoutine);
    this._socketService.emitRoutineUpdate(updated); // 🔥 Emitimos evento WebSocket
    return updated;
  }

  @AutoTouchVersion('routines')
  @Mutation(() => Boolean, { name: 'deleteRoutine' })
  async delete(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.routineService.deleteRoutine(id);
  }
}
