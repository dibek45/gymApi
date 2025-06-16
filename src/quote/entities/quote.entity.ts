// src/quote/entities/quote.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Quote {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  author: string;

  @Field(() => Int)
  @Column()
  dayOfYear: number;

  @Field(() => Int)
  @Column()
  gymId: number;
}
