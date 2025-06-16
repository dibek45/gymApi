import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/category.entity';

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field({ nullable: true })
  created_at?: string;

  @Column({ default: false })
  @Field(() => Boolean)
  available: boolean;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  img?: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  stock: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  price: number;
  

  @Column({ type: 'int', nullable: true }) // Revisión aquí
  @Field(() => Int, { nullable: true }) // Revisión aquí
  categoryId?: number;

  
  @Column({ name: 'gym_id', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  gymId?: number;

  @ManyToOne(() => Category, (category) => category.products, { nullable: false })
  @Field(() => Category)
  category: Category; // Relación Many-to-One con Category

  @Column({ type: 'varchar', length: 50, nullable: true }) // 🆕 Nueva columna barcode
  @Field({ nullable: true })
  barcode?: string;

   // 🔥 New boolean field to mark a product as a membership
   @Column({ type: 'boolean', default: false })
   @Field(() => Boolean, { nullable: true })
   isMembership?: boolean;
}



@Entity()
@ObjectType()
export class ProductToSale {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  price: number;
  
}
