import { Module } from '@nestjs/common';


import { PlanResolver } from './plan.resolver';
import { PlanService } from './plan.service';
import { Plan } from './plan.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from 'src/gym/gym.entity';

@Module({
  providers: [PlanResolver,PlanService],
 imports:[
  TypeOrmModule.forFeature([Plan,Gym]),

 ]
})
export class PlanModule {}
