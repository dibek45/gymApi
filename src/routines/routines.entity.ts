import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ExerciseType } from './exercise-type.entity';

@ObjectType()
@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 50 })
  @Field()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ type: 'text' })
  @Field()
  link: string;

  @Column({ type: 'text' })
  @Field()
  path: string;

  @Column({ type: 'int' })
  @Field()
  count: number;

  @ManyToOne(() => ExerciseType, (exerciseType) => exerciseType.routines, { eager: true })
  @JoinColumn({ name: 'exerciseTypeId' })
  @Field(() => ExerciseType)
  exerciseType: ExerciseType;

  @Column()
  @Field(() => Int)
  exerciseTypeId: number;

  // 👇 Campo opcional para sincronización por gimnasio
  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  gymId?: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
