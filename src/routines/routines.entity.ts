import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ExerciseType } from './exercise-type.entity';

@ObjectType()
@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  @Field()
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

 
  // Relación con ExerciseType
  @ManyToOne(() => ExerciseType, (exerciseType) => exerciseType.routines, { eager: true })
  @JoinColumn({ name: 'exerciseTypeId' })
  @Field(() => ExerciseType)
  exerciseType: ExerciseType;

  @Column()
  @Field()
  exerciseTypeId: number; // Identificador del tipo de ejercicio

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
