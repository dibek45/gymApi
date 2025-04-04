import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Qr } from './qr.entity';

@ObjectType()
@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @Column({ type: 'int' })
  @Field(() => Int)
  gymId: number; // ✅ La máquina pertenece al gym
  
  @OneToMany(() => Qr, (qr) => qr.machine, { cascade: true, eager: true })
  @Field(() => [Qr], { nullable: true })
  qrs?: Qr[];
}
