import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty,MaxLength, IsBoolean, IsInt, IsNumber } from "class-validator";


@InputType()
export class UpdatePlan{

    @Field(() => Number, {description:"Int", nullable:false}) // Cambiado a String
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @Field(() => String,{description:"Name",nullable:true})
    @IsString()
    @MaxLength(20)
    name: string;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Boolean,{description:"actived",nullable:true})
    @IsBoolean()
    actived: boolean;

    @Field(() => Int, { nullable: true })
    gymId?: number;
}