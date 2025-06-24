import { Module } from '@nestjs/common';
import { PromotionResolver } from './promotion.resolver';
import { PromotionService } from './promotion.service';
import { Promotion } from './promotion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionType } from './type-promotion.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [PromotionResolver, PromotionService,AppGateway],
  imports: [
    TypeOrmModule.forFeature([Promotion,PromotionType]),
  ],
})
export class PromotionModule {}
