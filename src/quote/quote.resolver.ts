// src/quote/quote.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { QuoteService } from './quote.service';
import { Quote } from './entities/quote.entity';

@Resolver(() => Quote)
export class QuoteResolver {
  constructor(private readonly quoteService: QuoteService) {}

  @Query(() => Quote)
  getQuoteOfTheDay(): Promise<Quote> {
    return this.quoteService.getQuoteOfTheDay();
  }
}
