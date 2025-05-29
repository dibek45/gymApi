import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { ExpenseService } from './exponse.service';
import { Expense } from './exponse.entity';
import { CreateExpenseInput } from './dto/inputs/create-exponse-input.dto';
import { UpdateExpenseInput } from './dto/inputs/update-exponse.input.dto';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';
import { AppGateway } from 'src/app.gateway';

@Resolver()
export class ExpenseResolver {
  constructor(private readonly _expense: ExpenseService,    private readonly _socketService: AppGateway,
  ) {}

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

  @AutoTouchVersion('expenses')
  @AutoTouchVersion('cashRegisters')
  @Mutation(() => Expense, { name: "createExpense" })
  async createInput(@Args('createExpense') createExpense: CreateExpenseInput) {
        this._socketService.emitExpenseUpdate(createExpense); // 🔄 emitimos a clientes

    return await this._expense.create(createExpense);
  }

  @AutoTouchVersion('expenses')
  @Mutation(() => Expense, { name: "updateExpenseByDS" })
  updateInput(@Args('updateExpense') updateExpense: UpdateExpenseInput) {
        this._socketService.emitExpenseUpdate(updateExpense); // 🔄 emitimos a clientes

    return this._expense.update(updateExpense);
  }

@AutoTouchVersion('expenses')
@Mutation(() => Boolean, { name: "deleteExpense" })
async delete(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
  const expense = await this._expense.findOne(id); // Obtener el expense antes de borrar
  const deleted = await this._expense.deleteExpense(id);

  if (deleted && expense?.gymId) {
    this._socketService.emitExpenseDeleted(id, expense.gymId); // ✅ emitir evento de eliminación
  }

  return deleted;
}
}
