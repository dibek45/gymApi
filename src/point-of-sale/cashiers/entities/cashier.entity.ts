import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CashRegister } from 'src/point-of-sale/entities/cash-register.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('cashiers')
export class Cashier {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // No expongas este campo en GraphQL

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field(() => Int)
  @Column()
  gymId: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


  @OneToMany(() => CashRegister, (cashRegister) => cashRegister.cashier)
  @Field(() => [CashRegister])
  cashRegisters: CashRegister[];
}
