import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity('checkins')
export class Checkin {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ name: 'member_id', type: 'int' })
  @Field(() => Int)
  memberId: number;

  @Column({ name: 'gym_id', type: 'int' })
  @Field(() => Int)
  gymId: number;

  @Column({ name: 'checkin_date', type: 'varchar' })
  @Field()
  checkinDate: string;

  

  @Column({ name: 'created_by', type: 'varchar' })
  @Field()
  createdBy: string;

  @Field(() => Date)
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
timestamp: Date;

@Field(() => Date)
@CreateDateColumn({ type: 'timestamp' })
createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field({ nullable: true })
  updatedAt?: string;

  @Column({ name: 'is_synced', type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: true })
  isSynced?: boolean;

  @Column({ name: 'sync_error', type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: true })
  syncError?: boolean;

  @Column({ name: 'temp_id', type: 'varchar', nullable: true })
  @Field({ nullable: true })
  tempId?: string;
}
