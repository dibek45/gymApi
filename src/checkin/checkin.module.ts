import { Module } from '@nestjs/common';
import { CheckinResolver } from './checkin.resolver';
import { CheckinService } from './checkin.service';
import { Checkin } from './checkin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [
    CheckinResolver,
    CheckinService,
    AppGateway // ✅ WebSocket para emitir eventos
  ],
  imports: [
    TypeOrmModule.forFeature([Checkin]) // ✅ solo necesitas la entidad Checkin
  ],

    exports: [CheckinService], // 👈 Esto es CRÍTICO

})
export class CheckinModule {}
