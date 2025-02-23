import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';
import { OpsTeam } from './ops-team.entity';

@ObjectType()
@Entity('roles')
export class Role {
  
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Int)
  @Column()
  gymId: number;

  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true })
  @JoinTable()
  permissions: Permission[];


  @OneToMany(() => OpsTeam, (opsTeam) => opsTeam.role)
  users: OpsTeam[];
  
  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
