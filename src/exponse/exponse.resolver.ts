import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { ExpenseService } from './exponse.service';
import { Expense } from './exponse.entity';
import { CreateExpenseInput } from './dto/inputs/create-exponse-input.dto';
import { UpdateExpenseInput } from './dto/inputs/update-exponse.input.dto';

@Resolver()
export class ExpenseResolver {
  constructor(private readonly _expense: ExpenseService) {}

  @Query(() => [Expense], { name: 'expenses' })
  findAll() {
    return this._expense.findAll();
  }

  @Query(() => [Expense], { name: 'expensesByGym' }) // 🔹 Consulta por gymId
  findByGym(@Args('gymId', { type: () => Int }) gymId: number) {
    return this._expense.findByGymId(gymId);
  }

  @Query(() => Expense, { name: 'expense' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    console.log("entra a expense resolver");
    const found = await this._expense.findOne(id);
    console.log(found);
    return found;
  }

  @Mutation(() => Expense, { name: "createExpense" })
  async createInput(@Args('createExpense') createExpense: CreateExpenseInput) {
    return await this._expense.create(createExpense);
  }

  @Mutation(() => Expense, { name: "updateExpenseByDS" })
  updateInput(@Args('updateExpense') updateExpense: UpdateExpenseInput) {
    return this._expense.update(updateExpense);
  }

  @Mutation(() => Boolean, { name: "deleteExpense" })
  delete(@Args('id', { type: () => Int }) id: number) {
    return this._expense.deleteExpense(id);
  }
}
