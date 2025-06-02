import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Gym } from 'src/gym/gym.entity';
import { Product } from 'src/product/product.entity';
import { CartItemInput } from '../dto/cart-item.input';
import { SaleDetail } from '../entities/sale-detail.entity';
import { CashRegister } from '../entities/cash-register.entity';
import { CashMovement } from '../entities/cash-movement.entity';
import { UserService } from 'src/user/user.service';
import { PubSubService } from 'src/shared/pub-sub.service';

@Injectable()
export class SaleService {
  constructor(
    private readonly pubSubService: PubSubService,

    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(Gym) private gymRepository: Repository<Gym>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(CashRegister) private cashRegisterRepository: Repository<CashRegister>,
    @InjectRepository(CashMovement) private cashMovementRepository: Repository<CashMovement>,
    private readonly userService: UserService,
  ) {}
async createSale(
  gymId: number,
  paymentMethod: string,
  cart: CartItemInput[],
  cashRegisterId: number
): Promise<Sale> {
  console.log(`🔹 Iniciando proceso de venta con transacción...`);

  return await this.saleRepository.manager.transaction(async manager => {
    const gym = await manager.findOne(Gym, { where: { id: gymId } });
    if (!gym) throw new Error(`❌ Gym con id ${gymId} no encontrado`);

    const cashRegister = await manager.findOne(CashRegister, { where: { id: cashRegisterId } });
    if (!cashRegister) throw new Error(`❌ Caja con id ${cashRegisterId} no encontrada`);

    let totalAmount = 0;

    const sale = manager.create(Sale, {
      paymentMethod,
      gym,
      cashRegister,
      cashRegisterId,
      cashierId: cashRegister.cashierId,
    });

    const saleDetails: SaleDetail[] = [];

    for (const item of cart) {
      const detail = item.isMembership
        ? await this.processMembership(item, sale, paymentMethod, manager)
        : await this.processProductSale(item, sale, manager);

      if (detail) {
        saleDetails.push(detail);
        totalAmount += detail.totalPrice;
      }
    }

    sale.totalAmount = parseFloat(totalAmount.toFixed(2));
    await manager.save(sale); // ✅ primero guarda venta con ID válida

    if (saleDetails.length > 0) {
      for (const detail of saleDetails) {
        detail.sale = sale;
        await manager.save(SaleDetail, detail);
      }
    }

    if (paymentMethod.toLowerCase() === 'efectivo') {
      const currentBalance = Number(cashRegister.currentBalance);
      const nuevoBalance = currentBalance + totalAmount;

      if (nuevoBalance !== currentBalance) {
        cashRegister.currentBalance = nuevoBalance;
        await manager.save(cashRegister);
      } else {
        console.warn('⚠️ El balance no cambió. Se omite el guardado de caja.');
      }
    }

    console.log(`✅ Venta y caja guardadas en una sola transacción`);

    if (cart.some(item => !item.isMembership)) {
      await this.pubSubService.touchVersion(gymId, 'products');
    }

    if (cart.some(item => item.isMembership)) {
      await this.pubSubService.touchVersion(gymId, 'members');
    }

    return sale;
  });
}





private async processMembership(
  item: CartItemInput,
  sale: Sale,
  paymentMethod: string,
  manager: any
): Promise<SaleDetail> {
  console.log(`🔹 Procesando membresía para el item: ${item.name}`);

  const daysToAdd = this.getMembershipDays(item.productId);

  if (item.idClienteTOMembership) {
    if (daysToAdd > 0) {
      await this.userService.updateAvailableDays({
        id: item.idClienteTOMembership,
        available_days: daysToAdd,
      });
      console.log(`✅ updateAvailableDays llamado para userId=${item.idClienteTOMembership} con ${daysToAdd} días.`);
    } else {
      console.warn(`❌ Días inválidos para el plan con id ${item.productId}. No se actualizó el usuario.`);
    }
  } else {
    console.warn(`❌ No se encontró 'idClienteTOMembership' en el item.`);
  }

  const saleDetail = manager.create(SaleDetail, {
    sale,
    product: null,
    membershipName: item.name,
    isMembership: true,
    quantity: 1,
    unitPrice: item.costo,
    totalPrice: parseFloat(item.costo.toFixed(2)),
  });

  console.log(`📌 Intentando insertar SaleDetail en la base de datos:`, JSON.stringify(saleDetail, null, 2));

  try {
    await manager.insert(SaleDetail, saleDetail);
    console.log(`✅ SaleDetail insertado correctamente.`);
    return saleDetail;
  } catch (error) {
    console.error(`❌ Error guardando SaleDetail:`, error);
    throw new Error(`Error guardando el detalle de la venta para la membresía.`);
  }
}





  /** ✅ Procesa la venta de un producto */
  private async processProductSale(item: CartItemInput, sale: Sale, manager: any): Promise<SaleDetail> {
  console.log(`🔹 Procesando producto con ID: ${item.productId}`);

  const product = await manager.findOne(Product, { where: { id: item.productId } });
  if (!product) {
    throw new Error(`❌ Producto con id ${item.productId} no encontrado`);
  }

  if (product.stock < item.quantity) {
    throw new Error(`❌ Stock insuficiente para producto con id ${item.productId}`);
  }

  product.stock -= item.quantity;
  await manager.save(product);
  console.log(`✅ Stock actualizado para producto ${product.id}. Nuevo stock: ${product.stock}`);

  const saleDetail = manager.create(SaleDetail, {
    sale,
    product,
    quantity: item.quantity,
    unitPrice: product.price,
    totalPrice: parseFloat((item.quantity * product.price).toFixed(2)),
  });

  return saleDetail;
}


  private async updateCashRegister(sale: Sale, amount: number): Promise<void> {
    console.log(`🔹 Actualizando caja registradora con +${amount}...`);
  
    const cashRegister = await this.cashRegisterRepository.findOne({
      where: {
              gym: sale.gym,  
              cashierId: sale.cashierId 
        },
    });
  
    if (!cashRegister) {
      throw new Error(`❌ No se encontró la caja registradora para gymId: ${sale.gym.id} y cashierId: ${sale.cashierId}`);
    }
  
    // ✅ Convert `currentBalance` to a number before updating
    const currentBalance = Number(cashRegister.currentBalance);
    cashRegister.currentBalance = currentBalance + amount;
  
    await this.cashRegisterRepository.save(cashRegister);
    await this.pubSubService.getPubSub().publish('cashRegisterUpdated', {
      cashRegisterUpdated: cashRegister,
    });
    console.log(`✅ Caja actualizada. Nuevo saldo: ${cashRegister.currentBalance}`);
  
   
  
    console.log(`✅ Movimiento de caja registrado.`);
  }
  

  /** ✅ Devuelve la cantidad de días según el tipo de membresía */
  private getMembershipDays(productId: number): number {
    switch (productId) {
      case 1: return 1;  // Plan Diario
      case 2: return 7;  // Plan Semanal
      case 3: return 30; // Plan Mensual
      case 4: return 365;// Plan Anual
      default:
        console.warn(`⚠️ No se ha definido mapeo de días para el plan con id ${productId}.`);
        return 0;
    }
  }



    // Método para obtener el total de todas las ventas
    async getTotalSales(): Promise<number> {
      const sales = await this.saleRepository.find();
      return sales.reduce((total, sale) => total + sale.totalAmount, 0);
    }
  
    // Método para obtener el total de ventas por método de pago
    async getTotalSalesByMethod(paymentMethod: string): Promise<number> {
      const sales = await this.saleRepository.find({ where: { paymentMethod } });
      return sales.reduce((total, sale) => total + sale.totalAmount, 0);
    }

    async findAllByGymId(gymId: number): Promise<Sale[]> {
      return this.saleRepository.find({
          where: { gym: { id: gymId } },
          relations: ["details", "details"], // ✅ Asegurar que `product` se cargue correctamente
          order: { id: "DESC" }
      });
  }
  
 
}
