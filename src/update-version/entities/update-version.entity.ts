import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()///
@Entity('update_versions') // 👈 nombre exacto de la tabla real en la DB
export class UpdateVersion {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  gym_id: number;

  @Field()
  @Column()
  table_name: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
