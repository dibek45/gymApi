import { Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty,MaxLength, IsBoolean, IsInt, IsNumber, IsEmpty } from "class-validator";


@InputType()
export class UpdateUser{

    @Field(() => Number, {description:"Int", nullable:false}) // Cambiado a String
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @Field(() => String,{description:"Name",nullable:true})
    @IsString()
    @MaxLength(20)
    name: string;

    @Field(() => Boolean,{description:"actived",nullable:true})
    @IsBoolean()
    actived: boolean;

    @Field(() => String,{description:"img",nullable:true})
    @IsString()
    img: string;11

    @Field(() => Number, {description:"Int", nullable:true}) 
    @IsNumber()
    @IsEmpty()
    gym_id: number;

    
    @Field(() => Number, {description:"Int", nullable:true}) 
    @IsNumber()
    @IsEmpty()
    available_days: number;

}



@InputType()
export class UpdateFingerPrintUserByID{

    @Field(() => Number, {description:"Int", nullable:false}) // Cambiado a String
    @IsNumber()
    @IsNotEmpty()
    id: number;
   

    @Field(() => String,{description:"huella",nullable:true})
    @IsString()
    huella: string;
}


// update-available-days.dto.ts


@InputType()
export class UpdateAvailableDaysDto {
  @Field(() => Int) // Decorador para exponer el tipo en el esquema GraphQL
  @IsNumber()       // Decoradores de validación
  @IsNotEmpty()
  id: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  available_days: number;
}
