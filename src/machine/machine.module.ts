import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineService } from './machine.service';
import { MachineResolver } from './machine.resolver';
import { Machine } from './entities/machine.entity';
import { Qr } from './entities/qr.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Qr])],
  providers: [MachineResolver, MachineService,AppGateway],
})
export class MachineModule {}
