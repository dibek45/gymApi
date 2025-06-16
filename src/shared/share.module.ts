// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { PubSubService } from './pub-sub.service';
import { UpdateVersionModule } from 'src/update-version/update-version.module';

@Module({
  providers: [PubSubService,],
  imports:[UpdateVersionModule],
  exports: [PubSubService],
})
export class SharedModule {}
