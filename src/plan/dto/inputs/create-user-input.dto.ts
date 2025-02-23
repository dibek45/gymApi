import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, MaxLength, IsBoolean, IsNumber } from "class-validator";
import { Column, PrimaryColumn } from "typeorm";

@InputType()
export class CreatePlan {
    
    @Field(() => Number) // Cambiado a String
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @Field(() => String)
    @IsString()
    @MaxLength(20)
    name: string;
    
    @Field(() => Float)
    price: number;

    @Field(() => Boolean)
    @IsBoolean()
    actived: boolean;
    
    @Field(() => Int)
    gymId: number;

}
