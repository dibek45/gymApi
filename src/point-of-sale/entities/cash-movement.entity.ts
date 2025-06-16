import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CashRegister } from './cash-register.entity';
import { Sale } from './sale.entity';
import { Gym } from './../../gym/gym.entity'
import { Cashier } from '../cashiers/entities/cashier.entity';

@Entity()
@ObjectType()
export class CashMovement {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Number)
  amount: number; // Monto del movimiento

  @Column()
  @Field(() => String)
  type: string; // Tipo de movimiento ('sale', 'deposit', 'withdrawal', 'expense')

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  concept?: string; // Concepto o descripción del movimiento

  @CreateDateColumn()
  @Field(() => Date)
  movementDate: Date; // Fecha y hora del movimiento

  // Relación con Caja Principal
  @ManyToOne(() => CashRegister, (cashRegister) => cashRegister.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cashRegisterId' })
  @Field(() => CashRegister)
  cashRegister: CashRegister;

  @Column()
  @Field(() => Int)
  cashRegisterId: number;

  // Relación con Cajero
  @ManyToOne(() => Cashier, { eager: true })
  @JoinColumn({ name: 'cashierId' })
  @Field(() => Cashier)
  cashier: Cashier;

  @Column({ nullable: true })
  @Field(() => Int)
  cashierId: number;


  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  saleId?: number;

  // Relación con Gimnasio (opcional, si lo necesitas)
  @ManyToOne(() => Gym, { nullable: true })
  @JoinColumn({ name: 'gymId' })
  @Field(() => Gym, { nullable: true })
  gym?: Gym;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  gymId?: number;

  @OneToMany(() => Sale, (sale) => sale.cashMovement, { cascade: true })
  @Field(() => [Sale], { nullable: true }) // Exponer en GraphQL
  sales?: Sale[];
  
}  
