import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
  const gym = await this.gymRepository.findOne({ where: { id: input.gymId } });
  if (!gym) {
    throw new BadRequestException(`Gym with id ${input.gymId} not found`);
  }

  const cashier = await this.cashierRepository.findOne({ where: { id: input.cashierId } });
  if (!cashier) {
    throw new BadRequestException(`Cashier with id ${input.cashierId} not found`);
  }

  // 🚫 Validación 1: Monto inicial debe ser >= 0
  if (input.openingBalance < 0) {
    throw new BadRequestException('Opening balance must be zero or positive.');
  }

  // 🚫 Validación 2: El cajero no debe tener una caja abierta
  const existingOpenCashRegister = await this.cashRegisterRepository.findOne({
    where: {
      cashier: { id: input.cashierId },
      status: 'open',
    },
  });

  if (existingOpenCashRegister) {
    throw new BadRequestException(`Cashier with id ${input.cashierId} already has an open cash register.`);
  }

  // 🚫 Validación 3: No más de 4 cajas abiertas por gimnasio
  const openRegistersInGym = await this.cashRegisterRepository.count({
    where: {
      gym: { id: input.gymId },
      status: 'open',
    },
  });

  if (openRegistersInGym >= 4) {
    throw new BadRequestException(`Gym with id ${input.gymId} already has 4 open cash registers.`);
  }

  const cashRegister = this.cashRegisterRepository.create({
    gym,
    cashier,
    cashierId: input.cashierId,
    openingBalance: input.openingBalance,
    currentBalance: input.openingBalance,
    status: 'open',
    openingTime: new Date(),
  });

await this.cashRegisterRepository.save(cashRegister);

// 🔁 Recarga la caja con la relación completa del cajero
return this.cashRegisterRepository.findOne({
  where: { id: cashRegister.id },
  relations: {
    cashier: true, // 🔑 Esto asegura que venga con cashier.userId
    gym: true      // ✅ También recargas el gym si lo usas en el return
  }
});}
  
async updateBalance(id: number, amount: number): Promise<CashRegister> {
  const cashRegister = await this.findOne(id);

  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  console.log('📊-+-+-+-+-+-+-+-+-+-++-----+-- Dentro de updateBalance, amount:', amount, 'Tipo:', typeof amount);

  if (isNaN(parsedAmount)) {
    throw new Error(`El monto recibido no es un número válido: ${amount}`);
  }
cashRegister.currentBalance = parseFloat(cashRegister.currentBalance as any);

  cashRegister.currentBalance += parsedAmount;
  return this.cashRegisterRepository.save(cashRegister);
}


  async findByGym(gymId: number): Promise<CashRegister[]> {
  return this.cashRegisterRepository.find({
    where: {
      gym: { id: gymId },
    },
    relations: ['movements', 'gym'],
  });
}


async close(id: number): Promise<CashRegister> {
  const cashRegister = await this.cashRegisterRepository.findOne({ where: { id } });

  if (!cashRegister) {
    throw new BadRequestException(`Cash register with id ${id} not found`);
  }

  if (cashRegister.status === 'closed') {
    throw new BadRequestException(`Cash register with id ${id} is already closed`);
  }

  cashRegister.status = 'closed';
  cashRegister.closingTime = new Date();
  // Si deseas guardar el balance final de forma explícita:
  cashRegister.closingBalance = cashRegister.currentBalance;

  return this.cashRegisterRepository.save(cashRegister);
}


async delete(id: number): Promise<{ gymId: number }> {
  const cashRegister = await this.cashRegisterRepository.findOne({
    where: { id },
    relations: { gym: true }
  });

  if (!cashRegister) {
    throw new NotFoundException(`Cash register with ID ${id} not found`);
  }

  await this.cashRegisterRepository.remove(cashRegister);

  return { gymId: cashRegister.gym.id };
}

}
