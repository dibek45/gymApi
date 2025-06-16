import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Checkin } from './checkin.entity';
import { CheckinService } from './checkin.service';
import { AppGateway } from 'src/app.gateway';
import { CreateCheckinInput } from './dto/inputs/create-checkin-input.dto';
import { UpdateCheckinInput } from './dto/inputs/update-checkin.input.dto';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';

@Resolver(() => Checkin)
export class CheckinResolver {
  constructor(
    private readonly _socketService: AppGateway,
    private readonly _checkinService: CheckinService
  ) {}

  @Query(() => [Checkin], { name: 'checkinsByGym' })
  async findAll(
    @Args('gymId', { type: () => Int }) gymId: number
  ): Promise<Checkin[]> {
    return this._checkinService.findAllByGym(gymId);
  }

  @Query(() => Checkin, { name: 'checkin' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Checkin> {
    return this._checkinService.findOne(id);
  }

  @AutoTouchVersion('checkins')
  @Mutation(() => Checkin, { name: 'createCheckin' })
  async createInput(
    @Args('createCheckin') createCheckin: CreateCheckinInput
  ): Promise<Checkin> {
    const created = await this._checkinService.create(createCheckin);
    this._socketService.emitCheckinUpdate(created);
    return created;
  }

  @AutoTouchVersion('checkins')
  @Mutation(() => Checkin, { name: 'updateCheckin' })
  async updateInput(
    @Args('updateCheckin') updateCheckin: UpdateCheckinInput
  ): Promise<Checkin> {
    const updated = await this._checkinService.update(updateCheckin);
    this._socketService.emitCheckinUpdate(updated);
    return updated;
  }

  @AutoTouchVersion('checkins')
  @Mutation(() => Boolean, { name: 'deleteCheckin' })
  async delete(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this._checkinService.delete(id);
  }
}
