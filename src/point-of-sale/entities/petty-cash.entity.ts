// src/point-of-sale/entities/pettyCash.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Gym } from 'src/gym/gym.entity';

@Entity()
@ObjectType()
export class PettyCash {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => String)
  balance: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Column()
  @Field(() => Int)
  gymId: number;


}
