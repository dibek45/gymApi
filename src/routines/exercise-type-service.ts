import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseType } from './exercise-type.entity';

@Injectable()
export class ExerciseTypeService {
  constructor(
    @InjectRepository(ExerciseType)
    private readonly exerciseTypeRepository: Repository<ExerciseType>,
  ) {}

  // Fetch all ExerciseTypes with their related routines
  async findAll(gymId: number): Promise<ExerciseType[]> {
    return this.exerciseTypeRepository.find({
      where: { gymId },
      relations: ['routines'], // Load the related routines
    });
  }

  // Fetch a single ExerciseType by ID, including routines
  async findOneById(id: number): Promise<ExerciseType> {
    return this.exerciseTypeRepository.findOne({
      where: { id },
      relations: ['routines'], // Load routines for the specific exercise type
    });
  }

  // Create a new ExerciseType
  async create(exerciseTypeData: Partial<ExerciseType>): Promise<ExerciseType> {
    const exerciseType = this.exerciseTypeRepository.create(exerciseTypeData);
    return this.exerciseTypeRepository.save(exerciseType);
  }

  // Update an existing ExerciseType
  async update(id: number, updateData: Partial<ExerciseType>): Promise<ExerciseType> {
    const exerciseType = await this.exerciseTypeRepository.findOne({ where: { id } });
    if (!exerciseType) {
      throw new Error(`ExerciseType with ID ${id} not found`);
    }

    Object.assign(exerciseType, updateData); // Merge the updates
    return this.exerciseTypeRepository.save(exerciseType);
  }

  // Delete an ExerciseType by ID
  async delete(id: number): Promise<void> {
    const result = await this.exerciseTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`ExerciseType with ID ${id} not found`);
    }
  }
}
