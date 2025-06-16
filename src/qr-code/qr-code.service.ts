import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRCode } from './qr-code.entity';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CheckinService } from 'src/checkin/checkin.service';
import { AppGateway } from 'src/app.gateway';
import { CreateCheckinInput } from 'src/checkin/dto/inputs/create-checkin-input.dto';

@Injectable()
export class QRCodeService {
  constructor(    private checkinService: CheckinService,

    @InjectRepository(QRCode)
    private qrCodeRepository: Repository<QRCode>,
    private readonly socketService: AppGateway

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

  
  async getUserByQRCode(code: string): Promise<User> {
  const qrCode = await this.qrCodeRepository.findOne({
    where: { code },
    relations: ['user'],
  });

  if (!qrCode) throw new Error('Código QR no válido');
  if (qrCode.expiresAt < new Date()) throw new Error('Código QR expirado');

  const user = qrCode.user;
const now = new Date().toISOString();

  // Solo se mandan los datos mínimos; el servicio asigna fechas internamente
  const checkinInput: CreateCheckinInput = {
    memberId: user.id,
    gymId: user.gymId,
    createdBy: "",
      checkinDate: now,

  };

  const createdCheckin = await this.checkinService.create(checkinInput);

  // Emitir por socket
  this.socketService.emitCheckinUpdate(createdCheckin);

  // Eliminar el QR para que no se reutilice
  await this.qrCodeRepository.delete({ id: qrCode.id });

  return user;
}

}
