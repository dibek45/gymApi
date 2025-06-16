import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cashier } from './entities/cashier.entity';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';

@Injectable()
export class CashiersService {
  constructor(
    @InjectRepository(Cashier)
    private readonly cashierRepo: Repository<Cashier>,
  ) {}

  // Crear un nuevo cajero
  async create(dto: CreateCashierDto): Promise<Cashier> {
    const cashier = this.cashierRepo.create({ ...dto, password: dto.password });
    return this.cashierRepo.save(cashier);
  }

  // Obtener todos los cajeros
  async findAll(gymId: number): Promise<Cashier[]> {
    return this.cashierRepo.find({ where: { gymId:gymId } });
  }

  // Obtener un cajero por ID
  async findOne(gymId: number): Promise<Cashier> {
    return this.cashierRepo.findOne({ where: { gymId:gymId } });
  }

  // Actualizar un cajero existente
  async update(id: number, dto: UpdateCashierDto): Promise<Cashier> {
    const cashier = await this.cashierRepo.preload({ id, ...dto });
    if (dto) {
      cashier.password = dto.password;
    }
    return this.cashierRepo.save(cashier);
  }

async remove(id: number): Promise<{ gymId: number }> {
  const cashier = await this.cashierRepo.findOne({ where: { id } });
  if (!cashier) throw new Error(`Cashier with ID ${id} not found`);

  await this.cashierRepo.delete(id);

  return { gymId: cashier.gymId }; // para que el resolver pueda emitir el socket
}

}
