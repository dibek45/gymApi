// src/gym/entities/gym.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PettyCash } from 'src/point-of-sale/entities/petty-cash.entity';
import { CashMovement } from 'src/point-of-sale/entities/cash-movement.entity';
import { CashRegister } from 'src/point-of-sale/entities/cash-register.entity';
import { Sale } from 'src/point-of-sale/entities/sale.entity';
import { Promotion } from 'src/promotions/promotion.entity';
import { Routine } from 'src/routines/routines.entity';
import { ExerciseType } from 'src/routines/exercise-type.entity';
import { Plan } from 'src/plan/plan.entity';

@Entity()
@ObjectType()
export class Gym {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  location: string;



  @OneToMany(() => CashMovement, (cashMovement) => cashMovement.gym)
  @Field(() => [CashMovement], { nullable: true })
  cashMovements?: CashMovement[];

  @OneToMany(() => Sale, (sale) => sale.gym, { cascade: true }) // Relación de uno a muchos
  @Field(() => [Sale]) // Permite acceso en GraphQL
  sales: Sale[];


  @OneToMany(() => CashRegister, (cashRegister) => cashRegister.gym)
@Field(() => [CashRegister])
cashRegisters: CashRegister[];


@OneToMany(() => Promotion, (promotion) => promotion.gym, { cascade: true })
@Field(() => [Promotion], { nullable: true })
promotions?: Promotion[];



@OneToMany(() => ExerciseType, (exerciseType) => exerciseType.gym)
@Field(() => [ExerciseType], { nullable: true })
exerciseTypes?: ExerciseType[];

@OneToMany(() => Plan, (plan) => plan.gym) // Relación con Plan
@Field(() => [Plan], { nullable: true })
plans?: Plan[];
}
