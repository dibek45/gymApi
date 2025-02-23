import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // Importa la entidad User

@Entity('qr_codes') // Esto marca la clase como una tabla de TypeORM
@ObjectType() // Esto marca la clase como un tipo de GraphQL
export class QRCode {
  @PrimaryGeneratedColumn('uuid') // Genera automáticamente un UUID único
  @Field() // Exponemos esta propiedad en el esquema de GraphQL
  id: string;

  @Column()
  @Field()
  code: string; // Código único del QR

  @ManyToOne(() => User, (user) => user.qrCodes, { eager: true })
  @Field(() => User) // Relación con el usuario
  user: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column()
  @Field()
  expiresAt: Date;
}
