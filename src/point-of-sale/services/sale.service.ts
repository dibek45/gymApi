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

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(Gym) private gymRepository: Repository<Gym>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(CashRegister) private cashRegisterRepository: Repository<CashRegister>,
    @InjectRepository(CashMovement) private cashMovementRepository: Repository<CashMovement>,
    private readonly userService: UserService,
  ) {}

  /** ✅ Método principal para crear una venta */
  async createSale(gymId: number, paymentMethod: string, cart: CartItemInput[]): Promise<Sale> {
    console.log(`🔹 Iniciando proceso de venta para gymId: ${gymId}`);

    const gym = await this.gymRepository.findOne({ where: { id: gymId } });
    if (!gym) {
      throw new Error(`❌ Gym con id ${gymId} no encontrado`);
    }
    console.log(`✅ Gimnasio encontrado: ${gym.id}`);

    let totalAmount = 0;
    const sale = this.saleRepository.create({
      paymentMethod,
      gym,
      cashierId: 1,
    });

    const saleDetails: SaleDetail[] = [];

    for (const item of cart) {
      if (item.isMembership) {
        const membershipDetail = await this.processMembership(item, sale, paymentMethod);
        saleDetails.push(membershipDetail);
      } else {
        const productDetail = await this.processProductSale(item, sale);
        saleDetails.push(productDetail);
      }
      totalAmount += saleDetails[saleDetails.length - 1].totalPrice;
    }

    sale.details = saleDetails;
    sale.totalAmount = parseFloat(totalAmount.toFixed(2));

    console.log(`💰 Total calculado: ${sale.totalAmount}`);

    if (paymentMethod.toLowerCase() === 'efectivo') {
      await this.updateCashRegister(sale, totalAmount);
    }

    await this.saleRepository.save(sale);
    console.log(`✅ Venta guardada con ID: ${sale.id}`);

    return sale;
  }

  /** ✅ Procesa la venta de una membresía */
  private async processMembership(item: CartItemInput, sale: Sale, paymentMethod: string): Promise<SaleDetail> {
    console.log(`🔹 Procesando membresía para el item: ${item.name}`);

    // Determinar los días según el plan
    const daysToAdd = this.getMembershipDays(item.productId);

    if (item.idClienteTOMembership) {
      await this.userService.updateAvailableDays({
        id: item.idClienteTOMembership,
        available_days: daysToAdd,
      });
      console.log(`✅ updateAvailableDays llamado para userId=${item.idClienteTOMembership} con ${daysToAdd} días.`);
    } else {
      console.warn(`❌ No se encontró 'idClienteTOMembership' en el item.`);
    }

    const saleDetail = new SaleDetail();
    saleDetail.product = null; // No hay un producto en la base de datos para membresías
    saleDetail.quantity = 1;
    saleDetail.unitPrice = item.costo;
    saleDetail.totalPrice = parseFloat(item.costo.toFixed(2));

    if (paymentMethod.toLowerCase() === 'efectivo') {
      await this.updateCashRegister(sale, item.costo);
    }

    return saleDetail;
  }

  /** ✅ Procesa la venta de un producto */
  private async processProductSale(item: CartItemInput, sale: Sale): Promise<SaleDetail> {
    console.log(`🔹 Procesando producto con ID: ${item.productId}`);

    const product = await this.productRepository.findOne({ where: { id: item.productId } });
    if (!product) {
      throw new Error(`❌ Producto con id ${item.productId} no encontrado`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`❌ Stock insuficiente para producto con id ${item.productId}`);
    }

    product.stock -= item.quantity;
    await this.productRepository.save(product);
    console.log(`✅ Stock actualizado para producto ${product.id}. Nuevo stock: ${product.stock}`);

    const saleDetail = new SaleDetail();
    saleDetail.product = product;
    saleDetail.quantity = item.quantity;
    saleDetail.unitPrice = product.price;
    saleDetail.totalPrice = parseFloat((item.quantity * product.price).toFixed(2));

    return saleDetail;
  }

  private async updateCashRegister(sale: Sale, amount: number): Promise<void> {
    console.log(`🔹 Actualizando caja registradora con +${amount}...`);
  
    const cashRegister = await this.cashRegisterRepository.findOne({
      where: { gym: sale.gym, cashierId: sale.cashierId },
    });
  
    if (!cashRegister) {
      throw new Error(`❌ No se encontró la caja registradora para gymId: ${sale.gym.id} y cashierId: ${sale.cashierId}`);
    }
  
    // ✅ Convert `currentBalance` to a number before updating
    const currentBalance = Number(cashRegister.currentBalance);
    cashRegister.currentBalance = currentBalance + amount;
  
    await this.cashRegisterRepository.save(cashRegister);
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
        where: { gym: { id: gymId } },     relations: ['gym'],
      });
    }
  
}
