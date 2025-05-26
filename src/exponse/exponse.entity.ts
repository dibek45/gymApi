import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Gym } from '../gym/gym.entity';
import { Cashier } from 'src/point-of-sale/cashiers/entities/cashier.entity';

@ObjectType()
@Entity()
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
  @Field()
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

  @Column()
  @Field(() => Int)
  gymId: number;

  @ManyToOne(() => Gym, (gym) => gym.expenses, { nullable: true, onDelete: 'SET NULL' })
  @Field(() => Gym, { nullable: true })
  gym?: Gym;

  

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
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
