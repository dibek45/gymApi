import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoutineService } from './routines.service';
import { CreateRoutine } from './dto/inputs/create-routines-input.dto';
import { UpdateRoutine } from './dto/inputs/update-routines.input.dto';
import { Routine } from './routines.entity';
import { ExerciseType } from './exercise-type.entity';
import { ExerciseTypeService } from './exercise-type-service';

@Resolver(() => Routine)
export class RoutineResolver {
  constructor(private readonly routineService: RoutineService, private exerciseTypeService:ExerciseTypeService) {}



  @Query(() => [ExerciseType])
  async exerciseTypesByGym(@Args('gymId') gymId: number): Promise<ExerciseType[]> {
    // Llama al servicio para obtener ExerciseTypes con sus rutinas
    return this.exerciseTypeService.findAll(gymId);
  }
  /**
   * Obtener todas las rutinas con filtros opcionales
   */
  @Query(() => [Routine], { name: 'routines' })
  async findAll(
    @Args('exerciseTypeId', { type: () => Int, nullable: true }) exerciseTypeId?: number,
    @Args('gymId', { type: () => Int, nullable: true }) gymId?: number,
  ): Promise<Routine[]> {
    return this.routineService.findAll(exerciseTypeId, gymId);
  }

  /**
   * Obtener una rutina específica por ID
   */
  @Query(() => Routine, { name: 'routine' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Routine> {
    return this.routineService.findOne(id);
  }

  /**
   * Crear una nueva rutina
   */
  @Mutation(() => Routine, { name: 'createRoutine' })
  async create(@Args('createRoutine') createRoutine: CreateRoutine): Promise<Routine> {
    console.log(createRoutine)
    return this.routineService.create(createRoutine);
  }

  /**
   * Actualizar una rutina existente
   */
  @Mutation(() => Routine, { name: 'updateRoutine' })
  async update(@Args('updateRoutine') updateRoutine: UpdateRoutine): Promise<Routine> {
    return this.routineService.update(updateRoutine.id, updateRoutine);
  }

  /**
   * Eliminar una rutina por ID
   */
  @Mutation(() => Boolean, { name: 'deleteRoutine' })
  async delete(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.routineService.deleteRoutine(id);
  }
}
