import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { CreatePlan, UpdatePlan } from './dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  findAll(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  findByGymId(gymId: number): Promise<Plan[]> {
    return this.planRepository.find({ where: { gymId } });
  }

  findOne(id: number): Promise<Plan> {
    return this.planRepository.findOne({ where: { id } });
  }

  async create(createPlan: CreatePlan): Promise<Plan> {
    const newPlan = this.planRepository.create(createPlan);
    return this.planRepository.save(newPlan);
  }

  async update(updatePlan: UpdatePlan): Promise<Plan> {
    await this.planRepository.update(updatePlan.id, updatePlan);
    return this.findOne(updatePlan.id);
  }

  async deletePlan(id: number): Promise<boolean> {
    const result = await this.planRepository.delete(id);
    return result.affected > 0;
  }

  async getStatus(id: number): Promise<Plan> {
    return this.findOne(id);
  }
}
