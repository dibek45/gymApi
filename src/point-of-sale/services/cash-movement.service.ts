import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashMovement } from '../entities/cash-movement.entity';
import { CreateCashMovementInput } from '../dto/create-cash-movement.dto';

@Injectable()
export class CashMovementService {
  constructor(
    @InjectRepository(CashMovement)
    private readonly cashMovementRepository: Repository<CashMovement>,
  ) {}

  // Consultar movimientos por caja
  async findByCashId(cashId: number): Promise<CashMovement[]> {
    return this.cashMovementRepository.find({
      where: { cashRegister: { id: cashId } },
      relations: ['cashRegister'],
    });
  }

  // Crear un nuevo movimiento
  async create(input: CreateCashMovementInput): Promise<CashMovement> {
    const movement = this.cashMovementRepository.create({
      ...input,
      cashRegister: { id: input.cashId }, // Relaciona la caja
      movementDate: new Date(), // Asigna la fecha actual si no está incluida
    });
    return this.cashMovementRepository.save(movement);
  }
  
}
