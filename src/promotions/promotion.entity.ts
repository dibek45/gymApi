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
import { Gym } from '../gym/gym.entity';
import { PromotionType } from './type-promotion.entity';

@ObjectType()
@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  img: string;

  @Column({ type: 'double precision' }) // Configuración para tipo DOUBLE en PostgreSQL
  @Field(() => Float) // GraphQL usa Float para valores decimales
  price: number;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  endDate: Date;

  @Column({ default: false })
  @Field()
  active: boolean;

  @ManyToOne(() => Gym, (gym) => gym.promotions, { nullable: false, eager: true })
  @JoinColumn({ name: 'gymId' }) // Vincula con la columna gymId
  @Field(() => Gym)
  gym: Gym;

  @Column()
  @Field()
  gymId: number; // Identificador del gimnasio asociado

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
  @ManyToOne(() => PromotionType, (promotionType) => promotionType.promotions, { eager: true })
  @JoinColumn({ name: 'promotionTypeId' })
  @Field(() => PromotionType)
  promotionType: PromotionType;
  
  @Column()
  @Field(() => Int)
  promotionTypeId: number; // Llave foránea para relacionar con PromotionType

}
