import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Machine } from './machine.entity';

@ObjectType()
@Entity()
export class Qr {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  code: string;

  @ManyToOne(() => Machine, (machine) => machine.qrs, { onDelete: 'CASCADE' })
  @Field(() => Machine)
  machine: Machine;

  @Column()
  @Field(() => Int)
  machineId: number;
}
