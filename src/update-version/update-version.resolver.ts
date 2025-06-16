import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UpdateVersion } from './entities/update-version.entity';
import { UpdateVersionService } from './update-version.service';

@Resolver(() => UpdateVersion)
export class UpdateVersionResolver {
  constructor(private readonly updateVersionService: UpdateVersionService) {}

  @Query(() => [UpdateVersion])
  getAllUpdateVersions(@Args('gymId') gymId: number): Promise<UpdateVersion[]> {
    return this.updateVersionService.findAllByGym(gymId);
  }

  
  @Mutation(() => Boolean)
  async testTouch(
    @Args('gymId', { type: () => Int }) gymId: number,
    @Args('table', { type: () => String }) table: string
  ): Promise<boolean> {
    console.log('🧪 Ejecutando testTouch con:', { gymId, table });
    await this.updateVersionService.touch(gymId, table);
    console.log('✅ touch ejecutado desde testTouch');
    return true;
  }
}
