import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCode } from './qr-code.entity';
import { QRCodeResolver } from './qr-code.resolver';
import { QRCodeService } from './qr-code.service';
import { CheckinModule } from 'src/checkin/checkin.module';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([QRCode]),CheckinModule],
  providers: [QRCodeService, QRCodeResolver,AppGateway],
})
export class QRCodeModule {}
