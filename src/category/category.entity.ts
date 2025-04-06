// src/category/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './../product/product.entity';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ default: 'Sin nombre' })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => Int)
  gymId: number; // Relación con el gimnasio
  
  @OneToMany(() => Product, (product) => product.category, { cascade: true }) // Relación de uno a muchos
  @Field(() => [Product], { nullable: true }) // Permite acceso en GraphQL
  products?: Product[];
}
