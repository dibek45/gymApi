// src/gym/gym.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gym } from './gym.entity';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym) private gymRepository: Repository<Gym>,
  ) {}

  async createGym(name: string, location: string): Promise<Gym> {
    const gym = this.gymRepository.create({ name, location });
    return this.gymRepository.save(gym);
  }
}
