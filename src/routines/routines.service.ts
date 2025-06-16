import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseType } from './exercise-type.entity';
import { Gym } from 'src/gym/gym.entity';
import { Routine } from './routines.entity';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(ExerciseType)
    private readonly exerciseTypeRepository: Repository<ExerciseType>,
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,
  ) {}

  /**
   * Crear una nueva rutina validando gymId y exerciseTypeId
   */
  async create(routineData: Partial<Routine>): Promise<Routine> {
    const { exerciseTypeId } = routineData;

    // Validar que el tipo de ejercicio existe
    const exerciseType = await this.exerciseTypeRepository.findOne({ where: { id: exerciseTypeId } });
    if (!exerciseType) {
      throw new NotFoundException(`Exercise type with ID ${exerciseTypeId} not found.`);
    }

    const routine = this.routineRepository.create(routineData);
    return this.routineRepository.save(routine);
  }

  /**
   * Actualizar una rutina existente validando gymId y exerciseTypeId
   */
  async update(id: number, updates: Partial<Routine>): Promise<Routine> {
    const routine = await this.findOne(id);

   

    // Validar exerciseTypeId si se proporciona
    if (updates.exerciseTypeId) {
      const exerciseType = await this.exerciseTypeRepository.findOne({ where: { id: updates.exerciseTypeId } });
      if (!exerciseType) {
        throw new NotFoundException(`Exercise type with ID ${updates.exerciseTypeId} not found.`);
      }
    }

    Object.assign(routine, updates);
    return this.routineRepository.save(routine);
  }

  /**
   * Obtener todas las rutinas filtradas por tipo de ejercicio y gymId
   */
  async findAll(exerciseTypeId?: number, gymId?: number): Promise<Routine[]> {
    const whereConditions: any = {};

    if (exerciseTypeId) {
      whereConditions.exerciseTypeId = exerciseTypeId;
    }

    if (gymId) {
      whereConditions.gymId = gymId;
    }

    return this.routineRepository.find({
      where: whereConditions,
    });
  }

  /**
   * Obtener una rutina por ID
   */
  async findOne(id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({ where: { id } });
    if (!routine) {
      throw new NotFoundException(`Routine with ID ${id} not found.`);
    }
    return routine;
  }

  /**
   * Eliminar una rutina por ID
   */
  async deleteRoutine(id: number): Promise<boolean> {
    const result = await this.routineRepository.delete(id);
    return result.affected > 0;
  }
}
