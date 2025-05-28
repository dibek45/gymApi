import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gym } from 'src/gym/gym.entity';
import { ExpenseService } from './exponse.service';
import { ExpenseResolver } from './exponse.resolver';
import { Expense } from './exponse.entity';
import { Cashier } from 'src/point-of-sale/cashiers/entities/cashier.entity';
import { AppGateway } from 'src/app.gateway';


@Module({
  providers: [ExpenseResolver, ExpenseService,    AppGateway // ✅ WebSocket para emitir eventos
  ],
  
  imports: [
    TypeOrmModule.forFeature([Expense, Gym, Cashier])
  ],
})
export class ExpenseModule {}
