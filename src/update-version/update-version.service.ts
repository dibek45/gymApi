import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateVersion } from './entities/update-version.entity';

@Injectable()
export class UpdateVersionService {
  constructor(
    @InjectRepository(UpdateVersion)
    private readonly repo: Repository<UpdateVersion>
  ) {}

  async findAllByGym(gymId: number): Promise<UpdateVersion[]> {
    return this.repo.find({ where: { gym_id: gymId } });
  }

  async touch(gymId: number, tableName: string): Promise<void> {
    console.log('🟢 [UpdateVersionService] touch() llamado con:', { gymId, tableName });
  
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(UpdateVersion)
      .values({ gym_id: gymId, table_name: tableName })
      .orUpdate({ conflict_target: ['gym_id', 'table_name'], overwrite: ['updated_at'] })
      .execute();
                  
    console.log(`✅ [UpdateVersionService] UPSERT ejecutado para ${tableName} del gym ${gymId}`);
  }
  
}
