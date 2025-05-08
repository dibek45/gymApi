// src/shared/pub-sub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private readonly pubSub = new PubSub();

  getPubSub(): PubSub {
    return this.pubSub;
  }
}
