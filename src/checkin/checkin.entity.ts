import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity('checkins') // aquí defines explícitamente el nombre de la tabla
export class Checkin {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => Int)
  memberId: number;

  @Column()
  @Field(() => Int)
  gymId: number;

  @Column()
  @Field()
  checkinDate: string;

  @Column()
  @Field()
  timestamp: string;

  @Column()
  @Field()
  createdBy: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt?: string;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt?: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  isSynced?: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  syncError?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tempId?: string;
}

