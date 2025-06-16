import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

@InputType()
export class CreateRoleInput {x
  @Field()
  @IsNotEmpty({ message: "El nombre del rol es obligatorio" }) // ✅ Validación para evitar valores vacíos
  @IsString({ message: "El nombre del rol debe ser una cadena de texto" }) // ✅ Evita valores numéricos
  name: string;

  @Field({ nullable: true })
  @IsString({ message: "La descripción debe ser una cadena de texto" }) // ✅ Evita valores inválidos
  description?: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "El gymId es obligatorio" }) // ✅ No puede ser null
  @IsInt({ message: "El gymId debe ser un número entero" }) // ✅ Asegura que sea un número
  gymId: number;
}
