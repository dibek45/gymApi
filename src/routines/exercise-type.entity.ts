import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Routine } from './routines.entity';
import { Gym } from 'src/gym/gym.entity';

@ObjectType()
@Entity()
export class ExerciseType {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ length: 50 })
  @Field()
  name: string;

  @Column() // gymId como columna en la base de datos
  @Field()
  gymId: number;

  @ManyToOne(() => Gym, (gym) => gym.exerciseTypes, { nullable: false })
  @JoinColumn({ name: 'gymId' }) // Relación con la entidad Gym
  @Field(() => Gym)
  gym: Gym;

  @OneToMany(() => Routine, (routine) => routine.exerciseType)
  @Field(() => [Routine], { nullable: true })
  routines?: Routine[];
}
