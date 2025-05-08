import { DataSource } from 'typeorm';
import { CashRegister } from './point-of-sale/entities/cash-register.entity';
import { CashMovement } from './point-of-sale/entities/cash-movement.entity';
import { Sale } from './point-of-sale/entities/sale.entity';
import { Gym } from './gym/gym.entity';
import { Cashier } from './point-of-sale/cashiers/entities/cashier.entity';
import { Promotion } from './promotions/promotion.entity';
import { PromotionType } from './promotions/type-promotion.entity';


// ✅ importa todas las entidades

import { ExerciseType } from './routines/exercise-type.entity';
import { Routine } from './routines/routines.entity';
import { Plan } from './plan/plan.entity';
import { PettyCash } from './point-of-sale/entities/petty-cash.entity';
import { SaleDetail } from './point-of-sale/entities/sale-detail.entity';
import { Product } from './product/product.entity';
import { Category } from './category/category.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres', // <--- nombre del servicio en Docker Compose
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: [
    Gym,
    CashRegister,
    CashMovement,
    Sale,
    Promotion,
    PromotionType,
    ExerciseType,
    Routine,
    Plan,
    Cashier,
    PettyCash,
    SaleDetail,
    Product,
    Category
  ],
  //migrations: ['src/migrations/**/*.ts'],
  migrations: ['src/migrations/1746493218946-AddUpdatedAtToCashRegister.ts'],

});
