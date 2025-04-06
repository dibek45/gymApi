// src/point-of-sale/entities/sale.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CashMovement } from './cash-movement.entity';
import { Gym } from '../../gym/gym.entity';
import { SaleDetail } from './sale-detail.entity';
import { CashRegister } from './cash-register.entity';

@Entity()
@ObjectType()
export class Sale {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Number)
  totalAmount: number;

  @Column()
  @Field(() => String)
  paymentMethod: string;

  @CreateDateColumn()
  @Field(() => Date)
  saleDate: Date;

 

  @Column({ nullable: true }) // Ahora permite valores nulos
  @Field(() => Int, { nullable: true }) // Cambiar en GraphQL para aceptar null
  cashierId: number | null;

  @ManyToOne(() => CashMovement, (cashMovement) => cashMovement.sales, { nullable: true })
  @JoinColumn({ name: 'cashMovementId' }) // Clave foránea en la base de datos
  @Field(() => CashMovement, { nullable: true }) // Exponer en GraphQL
  cashMovement?: CashMovement;
  
  
  

  @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true, eager: true }) // Agregar eager: true
  @Field(() => [SaleDetail], { nullable: true })
  details?: SaleDetail[];


  
  @ManyToOne(() => Gym, (gym) => gym.sales, { eager: false }) // eager: false para cargar explícitamente cuando sea necesario
  @JoinColumn({ name: 'gymId' }) // Nombre de la columna que referencia al gimnasio
  @Field(() => Gym)
  gym: Gym;


  @Column({ nullable: false }) // Asegura que el campo no sea nulo si siempre debe tener un valor
  @Field(() => Int) // Expón en GraphQL
  cashRegisterId: number;

  @ManyToOne(() => CashRegister, (cashRegister) => cashRegister.sales, { nullable: true, eager: true })
  @JoinColumn({ name: 'cashRegisterId' }) // Clave foránea en la base de datos
  @Field(() => CashRegister, { nullable: true }) // Exponer en GraphQL
  cashRegister?: CashRegister;
  

}
