import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('update_versions')
@Unique(['gym_id', 'table_name'])
export class UpdateVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gym_id: number;

  @Column()
  table_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
