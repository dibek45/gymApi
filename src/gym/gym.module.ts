// src/gym/gym.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './gym.entity';
import { GymService } from './gym.service';
import { GymResolver } from './gym.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Gym])], // Registro del repositorio Gym
  providers: [GymService,GymResolver],
  exports: [TypeOrmModule], // Exporta TypeOrmModule para que Gym esté disponible en otros módulos
})
export class GymModule {}
