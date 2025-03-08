import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SaleService } from '../services/sale.service';
import { Sale } from '../entities/sale.entity';
import { CartItemInput } from '../dto/cart-item.input';

@Resolver(() => Sale)
export class SaleResolver {
  constructor(private readonly saleService: SaleService) {}

  @Query(() => [Sale], { name: 'getSales' })
  async getSales(@Args('gymId') gymId: number): Promise<Sale[]> {
    return this.saleService.findAllByGymId(gymId);
  }

  @Mutation(() => Sale)
  async createSale(
    @Args('gymId', { type: () => Int }) gymId: number, // 🔥 Asegurar que sea Int
    @Args('paymentMethod') paymentMethod: string,
    @Args('cart', { type: () => [CartItemInput] }) cart: CartItemInput[],
    @Args('cashRegisterId', { type: () => Int }) cashRegisterId: number // 🔥 También Int
  ): Promise<Sale> {
    console.log(`🛠️ Recibiendo en GraphQL -> gymId: ${gymId}, cashRegisterId: ${cashRegisterId}`);
    return this.saleService.createSale(gymId, paymentMethod, cart, cashRegisterId);
  }
  
  


  // Consulta para obtener el total de ventas
  @Query(() => Number)
  async getTotalSales(): Promise<number> {
    return this.saleService.getTotalSales();
  }

  // Consulta para obtener el total de ventas en efectivo
  @Query(() => Number)
  async getTotalCashSales(): Promise<number> {
    return this.saleService.getTotalSalesByMethod('efectivo');
  }

  // Consulta para obtener el total de ventas con tarjeta
  @Query(() => Number)
  async getTotalCardSales(): Promise<number> {
    return this.saleService.getTotalSalesByMethod('tarjeta');
  }
}
