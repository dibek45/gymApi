import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { CashMovement } from './cash-movement.entity';
import { Gym } from 'src/gym/gym.entity';
import { Cashier } from '../cashiers/entities/cashier.entity';
import { Sale } from './sale.entity';

@Entity()
@ObjectType()
export class CashRegister {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  cashierId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Number)
  openingBalance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @Field(() => Number)
  currentBalance: number;

  

  @OneToMany(() => CashMovement, (cashMovement) => cashMovement.cashRegister)
  @Field(() => [CashMovement])
  movements: CashMovement[];

  @Column({ default: 'open' })
  @Field(() => String)
  status: string;

  @CreateDateColumn()
  @Field(() => Date)
  openingTime: Date;

  @ManyToOne(() => Gym, (gym) => gym.cashRegisters, { eager: true })
@JoinColumn({ name: 'gymId' }) // Asegura que la columna se asocia a la tabla
@Field(() => Gym)
gym: Gym;


@Column()
  @Field(() => Int)
  gymId: number; // Clave foránea para identificar el gimnasio

  @ManyToOne(() => Cashier, (cashier) => cashier.cashRegisters, { eager: true })
  @JoinColumn({ name: 'cashierId' })
  @Field(() => Cashier)
  cashier: Cashier;

  @OneToMany(() => Sale, (sale) => sale.cashRegister)
  @Field(() => [Sale], { nullable: true }) // Exponer en GraphQL
  sales?: Sale[];
}
