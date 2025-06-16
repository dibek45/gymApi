// src/point-of-sale/entities/sale-detail.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Sale } from './sale.entity';
import { Product } from './../../product/product.entity';

@Entity()
@ObjectType()
export class SaleDetail {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.details, { onDelete: 'CASCADE' })
  @Field(() => Sale) 
  sale: Sale;

  @ManyToOne(() => Product, { nullable: true, eager: true }) 
  @JoinColumn({ name: "productId" }) 
  @Field(() => Product, { nullable: true }) 
  product: Product | null;
  

  @Column('int')
  @Field(() => Int)
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  unitPrice: number;
  
  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  totalPrice: number;
  
  @Column({ type: "varchar", nullable: true }) 
  @Field({ nullable: true }) // ✅ Hacer accesible en GraphQL
  membershipName?: string;

  @Column({ type: "boolean", default: false }) 
  @Field(() => Boolean) // ✅ Saber si es una membresía o un producto
  isMembership: boolean;
}
