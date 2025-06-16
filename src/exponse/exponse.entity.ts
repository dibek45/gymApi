import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Gym } from '../gym/gym.entity';
import { Cashier } from 'src/point-of-sale/cashiers/entities/cashier.entity';
import { CashRegister } from 'src/point-of-sale/entities/cash-register.entity';

@ObjectType()
@Entity('expenses') // 👈 ahora se alinea con el nombre real
export class Expense {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 200 })
  @Field()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  amount: number;

  @Column()
  @Field()
  paymentMethod: string;

  @Column({ type: 'timestamp' })
  @Field(() => Date)
expenseDate: Date;


  @Column()
  @Field()
  category: string;

  @Column()
  @Field()
  createdBy: string;

  @Column()
  @Field(() => Int)
  cashierId: number;

  @ManyToOne(() => Cashier, { nullable: true, onDelete: 'SET NULL' })
  @Field(() => Cashier, { nullable: true })
  cashier?: Cashier;


  
 @Column({ nullable: true })
   @Field(() => Int)
  cashRegisterId: number;

  @ManyToOne(() => CashRegister)
  @JoinColumn({ name: 'cashRegisterId' })
  cashRegister: CashRegister;

  @Column()
  @Field(() => Int)
  gymId: number;

  @ManyToOne(() => Gym, (gym) => gym.expenses, { nullable: true, onDelete: 'SET NULL' })
  @Field(() => Gym, { nullable: true })
  gym?: Gym;

  

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


  @Column({ default: false })
  @Field({ nullable: true })
  isSynced?: boolean;

  @Column({ default: false })
  @Field({ nullable: true })
  syncError?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tempId?: string;
}
