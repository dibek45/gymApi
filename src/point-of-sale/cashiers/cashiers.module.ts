import { Module } from '@nestjs/common';
import { CashiersService } from './cashiers.service';
import { CashiersResolver } from './cashiers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cashier } from './entities/cashier.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Cashier])], // Registro del repositorio Gym
  providers: [CashiersResolver, CashiersService,AppGateway]
})
export class CashiersModule {}
