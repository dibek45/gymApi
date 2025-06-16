// src/quote/quote.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { QuoteService } from './quote.service';
import { Quote } from './entities/quote.entity';

@Resolver(() => Quote)
export class QuoteResolver {
  constructor(private readonly quoteService: QuoteService) {}

  @Query(() => Quote, { name: 'quoteOfTheDay' }) // nombre más claro
  async getQuoteOfTheDay(
    @Args('gymId', { type: () => Int, nullable: true }) gymId?: number,
  ): Promise<Quote> {
    return this.quoteService.getQuoteOfTheDay(gymId);
  }
  
}
