// src/point-of-sale/services/sale.service.ts
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

@Injectable()
export class SaleService {
  constructor(
    
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(Gym) private gymRepository: Repository<Gym>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(CashRegister) private cashRegisterRepository: Repository<CashRegister>,
    @InjectRepository(CashMovement) private cashMovementRepository: Repository<CashMovement>,


  ) {}

  async findAllByGymId(gymId: number): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { gym: { id: gymId } },     relations: ['gym'],
    });
  }

  // Método para crear una venta y actualizar la caja chica si es en efectivo
  async createSale(
    gymId: number,
    paymentMethod: string,
    cart: CartItemInput[]
  ): Promise<Sale> {
    console.log(`🔹 Iniciando proceso de venta para gymId: ${gymId}`);
  
    const gym = await this.gymRepository.findOne({ where: { id: gymId } });
    if (!gym) {
      console.error(`❌ Gym con id ${gymId} no encontrado`);
      throw new Error(`Gym with id ${gymId} not found`);
    }
    console.log(`✅ Gimnasio encontrado: ${gym.id}`);
  
    let totalAmount = 0;
    const sale = this.saleRepository.create({
      paymentMethod,
      gym,
      cashierId: 1,
    });
  
    const saleDetails = [];
  
    for (const item of cart) {
      console.log(`🔹 Procesando producto con ID: ${item.productId}`);
  
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        console.error(`❌ Producto con id ${item.productId} no encontrado`);
        throw new Error(`Product with id ${item.productId} not found`);
      }
  
      if (product.stock < item.quantity) {
        console.error(`❌ Stock insuficiente para producto con id ${item.productId}`);
        throw new Error(`Not enough stock for product with id ${item.productId}`);
      }
  
      product.stock -= item.quantity;
      await this.productRepository.save(product);
      console.log(`✅ Stock actualizado para producto ${product.id}. Nuevo stock: ${product.stock}`);
  
      const saleDetail = new SaleDetail();
      saleDetail.product = product;
      saleDetail.quantity = item.quantity;
      saleDetail.unitPrice = product.price;
      saleDetail.totalPrice = parseFloat((item.quantity * product.price).toFixed(2));
  
      saleDetails.push(saleDetail);
      totalAmount += saleDetail.totalPrice;
    }
  
    sale.details = saleDetails;
    sale.totalAmount = parseFloat(totalAmount.toFixed(2));
  
    console.log(`💰 Total calculado: ${sale.totalAmount}`);
  
    let cashMovement: CashMovement | null = null;
  
    if (paymentMethod.toLowerCase() === 'efectivo') {
      console.log("🔹 Buscando caja registradora...");
    
      const cashRegister = await this.cashRegisterRepository.findOne({
        where: { gym, cashierId: sale.cashierId },
      });
    
      if (!cashRegister) {
        console.error(`❌ No se encontró la caja registradora para gymId: ${gym.id} y cashierId: ${sale.cashierId}`);
        throw new Error(`Cash register for gym with id ${gym.id} not found`);
      }
      
      console.log(`✅ Caja registradora encontrada con ID: ${cashRegister.id}, Saldo actual: ${cashRegister.currentBalance}`);
    
      // 🔹 Asignar el `cashRegister` a la `Sale`
      sale.cashRegister = cashRegister;
    
      console.log(`✅ Sale vinculada con CashRegister ID: ${sale.cashRegister.id}`);
    }
    
    await this.saleRepository.save(sale);
  console.log(`✅ Venta guardada con ID: ${sale.id}, con CashMovement ID: ${sale.cashMovement?.id || 'NULL'}`);

// 🔹 ACTUALIZAR `cashMovement.saleId` DESPUÉS de Guardar `Sale`
if (cashMovement) {
  await this.cashMovementRepository.update(cashMovement.id, { saleId: sale.id });
  console.log(`✅ CashMovement actualizado con Sale ID: ${sale.id}`);
}

    return sale;
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
}
