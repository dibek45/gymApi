import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCode } from './qr-code.entity';
import { QRCodeResolver } from './qr-code.resolver';
import { QRCodeService } from './qr-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([QRCode])],
  providers: [QRCodeService, QRCodeResolver],
})
export class QRCodeModule {}
