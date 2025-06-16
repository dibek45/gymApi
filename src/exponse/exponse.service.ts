import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseInput } from './dto/inputs/create-exponse-input.dto';
import { UpdateExpenseInput } from './dto/inputs/update-exponse.input.dto';
import { Expense } from './exponse.entity';
import { AppGateway } from 'src/app.gateway';
import { CashRegisterService } from 'src/point-of-sale/services/cash-register.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly gateway: AppGateway, 
  private readonly cashRegisterService: CashRegisterService, // ✅
  ) {}

  findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  findByGymId(gymId: number): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { gymId } });
  }

  findOne(id: number): Promise<Expense> {
    return this.expenseRepository.findOne({ where: { id } });
  }

  async create(createExpense: CreateExpenseInput): Promise<Expense> {

    const newExpense = this.expenseRepository.create(createExpense);
    const amount = Number(createExpense.amount);
if (isNaN(amount)) throw new Error('Monto inválido');
console.log('🧮 Actualizando caja con amount:', -createExpense.amount, 'Tipo:', typeof createExpense.amount);

const updatedCashRegister = await this.cashRegisterService.updateBalance(
  createExpense.cashierId,
  -amount
);

  this.gateway.emitCashRegisterUpdate(updatedCashRegister);

    return this.expenseRepository.save(newExpense);
    
  }

  async update(updateExpense: UpdateExpenseInput): Promise<Expense> {
    await this.expenseRepository.update(updateExpense.id, updateExpense);
    return this.findOne(updateExpense.id);
  }

  async deleteExpense(id: number): Promise<boolean> {
    const result = await this.expenseRepository.delete(id);
    return result.affected > 0;
  }
}
