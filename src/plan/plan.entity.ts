import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Gym } from '../gym/gym.entity';

@ObjectType()
@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: Number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ default: false, type: 'boolean' })
  @Field(() => Boolean)
  actived = false;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Precio con 2 decimales
  @Field(() => Float)
  price: number;
  
  @CreateDateColumn()
  @Field()
  createdAt: Date;
  
  @Field(() => Int,{ nullable: true })
  @Column()
  gymId: number; // Relación con el gimnasio

  @ManyToOne(() => Gym, (gym) => gym.plans, { nullable: true, onDelete: 'SET NULL' }) // Relación opcional
  @Field(() => Gym, { nullable: true }) // Permite nulo en GraphQL
  gym?: Gym;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;


}
