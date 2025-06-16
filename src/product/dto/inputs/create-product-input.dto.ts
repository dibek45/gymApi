import { Field, InputType, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MaxLength, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

@InputType()
export class CreateProduct {

  @Field()
  @IsString()
  @MaxLength(100)
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  available: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  img?: string;

  @Field()
  @IsNumber()
  stock: number;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  categoria_id: number;

  @Field()
  @IsNumber()
  gymId: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  barcode?: string;
}
