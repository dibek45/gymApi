// src/shared/pub-sub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UpdateVersionService } from 'src/update-version/update-version.service';

@Injectable()
export class PubSubService {
  constructor(
    private readonly versionService: UpdateVersionService // <-- 👈 Agregado aquí
  ) {}
  private readonly pubSub = new PubSub();

  getPubSub(): PubSub {
    return this.pubSub;
  }
  async touchVersion(gymId: number, table: string) {
  await this.versionService.touch(gymId, table);
  this.getPubSub().publish(`${table}Updated`, { [`${table}Updated`]: true });
}
}
