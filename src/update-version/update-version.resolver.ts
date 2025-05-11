import { Resolver, Query, Args } from '@nestjs/graphql';
import { UpdateVersion } from './entities/update-version.entity';
import { UpdateVersionService } from './update-version.service';

@Resolver(() => UpdateVersion)
export class UpdateVersionResolver {
  constructor(private readonly updateVersionService: UpdateVersionService) {}

  @Query(() => [UpdateVersion])
  getAllUpdateVersions(@Args('gymId') gymId: number): Promise<UpdateVersion[]> {
    return this.updateVersionService.findAllByGym(gymId);
  }
}
