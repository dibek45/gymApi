import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Gym } from 'src/gym/gym.entity';
import { Promotion } from './promotion.entity';

@ObjectType()
@Entity()
export class PromotionType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 50 })
  @Field(() => String)
  name: string; // Nombre del tipo de promoción (por ejemplo, "seasonal", "duration", etc.)

  
  @Column({ length: 400 })
  @Field(() => String)
  description: string; // Nombre del tipo de promoción (por ejemplo, "seasonal", "duration", etc.)

  @OneToMany(() => Promotion, (promotion) => promotion.promotionType)
  @Field(() => [Promotion], { nullable: true })
  promotions?: Promotion[]; // Relación inversa con las promociones
}
