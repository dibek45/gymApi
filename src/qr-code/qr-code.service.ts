import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRCode } from './qr-code.entity';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QRCodeService {
  constructor(
    @InjectRepository(QRCode)
    private qrCodeRepository: Repository<QRCode>,
  ) {}

  async generateQRCode(userId: string): Promise<QRCode> {
    const code = uuidv4(); // Genera un código único
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 minutos

    // Asignar el usuario usando solo el ID
    const qrCode = this.qrCodeRepository.create({
      code,
      expiresAt,
      user: { id: Number(userId) } as User, // Usa una referencia parcial
    });

    return this.qrCodeRepository.save(qrCode);
  }
  // Validar un código QR y devolver el usuario asociado
  async getUserByQRCode(code: string): Promise<User> {
    const qrCode = await this.qrCodeRepository.findOne({
      where: { code },
      relations: ['user'], // Incluye la relación con el usuario
    });

    if (!qrCode) {
      throw new Error('Código QR no válido');
    }

    if (qrCode.expiresAt < new Date()) {
      throw new Error('Código QR expirado');
    }

    return qrCode.user; // Devuelve el usuario asociado
  }
}
