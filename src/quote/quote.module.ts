import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quote } from './entities/quote.entity';
import { QuoteService } from './quote.service';
import { QuoteResolver } from './quote.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QuoteService, QuoteResolver],
})

export class QuoteModule {}
