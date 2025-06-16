// src/gym/gym.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GymService } from './gym.service';
import { Gym } from './gym.entity';

@Resolver(() => Gym)
export class GymResolver {
  constructor(private readonly gymService: GymService) {}

  @Mutation(() => Gym)
  async createGym(
    @Args('name') name: string,
    @Args('location') location: string,
  ): Promise<Gym> {
    return this.gymService.createGym(name, location);
  }
}
