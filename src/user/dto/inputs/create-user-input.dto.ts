import { Field, InputType, ID,  } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MaxLength, IsBoolean, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateUser {
   

  @Field()
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  actived: boolean;

  @Field()
  @IsString()
@IsOptional()
  huella: string; // DTO que recibe 'huella' como Buffer

  @Field()
  @IsString()
  img: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  gymId: number;

  @Field()
  @IsNumber()
  available_days: number;
}
