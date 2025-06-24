import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Promotion } from './promotion.entity';
import { PromotionService } from './promotion.service';
import { CreatePromotion } from './dto/inputs/create-promotion-input.dto';
import { UpdatePromotion } from './dto/inputs/update-promotion.input.dto';
import { PromotionType } from './type-promotion.entity';
import { AppGateway } from 'src/app.gateway';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';

@Resolver(() => Promotion)
export class PromotionResolver {
  constructor(
    private readonly _promotion: PromotionService,
    private readonly _socketService: AppGateway,
  ) {}

  @Query(() => [Promotion], { name: 'promotions' })
  async findAll(
    @Args('gymId', { type: () => Int, nullable: true }) gymId?: number,
  ): Promise<Promotion[]> {
    return this._promotion.findAll(gymId);
  }

  @Query(() => [PromotionType], { name: 'getTypePromotionandPromotion' })
  async getTypePromotionandPromotion(): Promise<PromotionType[]> {
    return this._promotion.getTypePromotionandPromotion();
  }

  @Query(() => Promotion, { name: 'promotion' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Promotion> {
    return this._promotion.findOne(id);
  }

  @AutoTouchVersion('promotions')
  @Mutation(() => Promotion, { name: 'createPromotion' })
  async create(
    @Args('createPromotion') createPromotion: CreatePromotion,
  ): Promise<Promotion> {
    const created = await this._promotion.create(createPromotion);
    this._socketService.emitPromotionUpdate(created); // 🔥 Emitimos evento socket
    return created;
  }

  @AutoTouchVersion('promotions')
  @Mutation(() => Promotion, { name: 'updatePromotion' })
  async update(
    @Args('updatePromotion') updatePromotion: UpdatePromotion,
  ): Promise<Promotion> {
    const updated = await this._promotion.update(updatePromotion);
    this._socketService.emitPromotionUpdate(updated); // 🔥 Emitimos evento socket
    return updated;
  }

  @AutoTouchVersion('promotions')
  @Mutation(() => Boolean, { name: 'deletePromotion' })
  async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this._promotion.deletePromotion(id);
  }
}
