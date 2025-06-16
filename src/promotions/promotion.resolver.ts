import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Promotion } from './promotion.entity';
import { PromotionService } from './promotion.service';
import { CreatePromotion } from './dto/inputs/create-promotion-input.dto';
import { UpdatePromotion } from './dto/inputs/update-promotion.input.dto';
import { PromotionType } from './type-promotion.entity';

@Resolver(() => Promotion)
export class PromotionResolver {
    constructor(private readonly _promotion: PromotionService) {}

    /**
     * Get all promotions
     */
  
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
  
    /**
     * Get a promotion by ID
     */
    @Query(() => Promotion, { name: 'promotion' })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<Promotion> {
        return this._promotion.findOne(id);
    }

    /**
     * Create a new promotion
     */
    @Mutation(() => Promotion, { name: 'createPromotion' })
    async create(@Args('createPromotion') createPromotion: CreatePromotion): Promise<Promotion> {
        return this._promotion.create(createPromotion);
    }

    /**
     * Update a promotion
     */
    @Mutation(() => Promotion, { name: 'updatePromotion' })
    async update(
      @Args('updatePromotion') updatePromotion: UpdatePromotion,
    ): Promise<Promotion> {
      // Llama al servicio para actualizar la promoción usando su ID
      return this._promotion.update(updatePromotion);
    }
    
    /**
     * Delete a promotion
     */
    @Mutation(() => Boolean, { name: 'deletePromotion' })
    async delete(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        return this._promotion.deletePromotion(id);
    }
}
