// src/point-of-sale/point-of-sale.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { CashMovement } from './entities/cash-movement.entity';
import { PettyCash } from './entities/petty-cash.entity';
import { SaleService } from './services/sale.service';
import { CashMovementService } from './services/cash-movement.service';
import { SaleResolver } from './resolvers/sale.resolver';
import { CashMovementResolver } from './resolvers/cash-movement.resolver';
import { GymModule } from '../gym/gym.module'; // Importa GymModule
import { Product } from 'src/product/product.entity';
import { CashRegister } from './entities/cash-register.entity';
import { CashRegisterService } from './services/cash-register.service';
import { CashRegisterResolver } from './resolvers/cash-register.resolver';
import { Cashier } from './cashiers/entities/cashier.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, CashMovement, PettyCash,Product, CashRegister,Cashier]), // Registrar entidades específicas del módulo
    GymModule, // Importar el módulo de Gym para acceder al repositorio de Gym
    UserModule
  ],
  providers: [
    SaleService,
    CashMovementService,
    CashRegisterService,
    SaleResolver,
    CashMovementResolver,
    CashRegisterResolver,
    Cashier
  ],
  exports: [SaleService, CashMovementService],
})
export class PointOfSaleModule {}
