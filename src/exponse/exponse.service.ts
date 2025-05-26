import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseInput } from './dto/inputs/create-exponse-input.dto';
import { UpdateExpenseInput } from './dto/inputs/update-exponse.input.dto';
import { Expense } from './exponse.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
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
