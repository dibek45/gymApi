import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ default: false })
  @Field(() => Boolean)
  actived: boolean = false;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  huella: string; 

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  img: string; 

  @Column({ type: 'int', default: 1, nullable: true })
  @Field(() => Int, { nullable: true })
  gymId: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  available_days: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  @Field({ nullable: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  password: string;

  qrCodes: any;
}
