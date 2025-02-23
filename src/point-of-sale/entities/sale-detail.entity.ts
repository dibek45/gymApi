// src/point-of-sale/entities/sale-detail.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Sale } from './sale.entity';
import { Product } from 'src/product/product.entity';

@Entity()
@ObjectType()
export class SaleDetail {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.details, { onDelete: 'CASCADE' })
  sale: Sale;

  @ManyToOne(() => Product, { eager: true })
  @Field(() => Product)
  product: Product;

  @Column('int')
  @Field(() => Int)
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  unitPrice: number;
  
  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  totalPrice: number;
  
}
