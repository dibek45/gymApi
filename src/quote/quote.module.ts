import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCodeResolver } from 'src/qr-code/qr-code.resolver';
import { QRCodeService } from 'src/qr-code/qr-code.service';
import { Quote } from './entities/quote.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QRCodeService, QRCodeResolver],
})
export class QuoteModule {}
