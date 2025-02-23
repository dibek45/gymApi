import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { QRCode } from './qr-code.entity';
import { User } from '../user/user.entity';
import { QRCodeService } from './qr-code.service';

@Resolver(() => QRCode)
export class QRCodeResolver {
  constructor(private readonly qrCodeService: QRCodeService) {}

  // Mutación para generar un código QR, con nombre personalizado
  @Mutation(() => QRCode, { name: 'generateQRCode' })
  async generateQRCode(
    @Args('userId') userId: string,
  ): Promise<QRCode> {
    return this.qrCodeService.generateQRCode(userId);
  }

  // Consulta para obtener un usuario por código QR, con nombre personalizado
  @Query(() => User, { name: 'userByQRCode' })
  async getUserByQRCode(
    @Args('code') code: string,
  ): Promise<User> {
    return this.qrCodeService.getUserByQRCode(code);
  }
}
