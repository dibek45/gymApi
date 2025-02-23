import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashRegister } from '../entities/cash-register.entity';
import { CreateCashRegisterInput } from '../dto/create-cash-register.dto';
import { Gym } from 'src/gym/gym.entity';
import { Cashier } from '../cashiers/entities/cashier.entity';

@Injectable()
export class CashRegisterService {
  constructor(
    @InjectRepository(CashRegister)
    private readonly cashRegisterRepository: Repository<CashRegister>,
    @InjectRepository(Cashier)
    private readonly cashierRepository: Repository<Cashier>,
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,

    
  ) {}

  async findAll(): Promise<CashRegister[]> {
    return this.cashRegisterRepository.find({
      relations: ['movements', 'gym'], // Asegúrate de incluir relaciones necesarias
    });
  }

  async findOne(id: number): Promise<CashRegister> {
    return this.cashRegisterRepository.findOne({
      where: { id },
      relations: ['movements'],
    });
  }

  async create(input: CreateCashRegisterInput): Promise<CashRegister> {
    // Verificar y cargar el Gym
    const gym = await this.gymRepository.findOne({ where: { id: input.gymId } });
    if (!gym) throw new Error(`Gym with id ${input.gymId} not found`);
  
    // Verificar y cargar el Cashier
    const cashier = await this.cashierRepository.findOne({ where: { id: input.cashierId } });
    if (!cashier) throw new Error(`Cashier with id ${input.cashierId} not found`);
  
    // Crear el registro de caja
    const cashRegister = this.cashRegisterRepository.create({
      gym, // Asociar el Gym
      cashier, // Asociar el Cajero
      cashierId: input.cashierId,
      openingBalance: input.openingBalance,
      currentBalance: input.openingBalance,
      status: 'open',
      openingTime: new Date(),
    });
  
    // Guardar y devolver el registro
    return this.cashRegisterRepository.save(cashRegister);
  }
  
  async updateBalance(id: number, amount: number): Promise<CashRegister> {
    const cashRegister = await this.findOne(id);
    cashRegister.currentBalance += amount;
    return this.cashRegisterRepository.save(cashRegister);
  }


  async findByGym(gymId: number): Promise<CashRegister[]> {
    return this.cashRegisterRepository.find({
      relations: ['movements', 'gym'], // Asegúrate de incluir relaciones necesarias
       });
  }

}
