import { Module } from '@nestjs/common';
import { RoutineResolver } from './routines.resolver';
import { RoutineService } from './routines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './routines.entity';
import { ExerciseType } from './exercise-type.entity';
import { Gym } from 'src/gym/gym.entity';
import { ExerciseTypeService } from './exercise-type-service';

@Module({
  providers: [RoutineResolver, RoutineService,ExerciseTypeService],
  imports: [
    TypeOrmModule.forFeature([Routine,ExerciseType,Gym]), // Registra la entidad Routine
  ],
})
export class RoutineModule {}
