import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateVersion } from './entities/update-version.entity';
import { UpdateVersionService } from './update-version.service';
import { UpdateVersionResolver } from './update-version.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UpdateVersion])],
  providers: [UpdateVersionService, UpdateVersionResolver],
  exports: [UpdateVersionService]
})
export class UpdateVersionModule {}
