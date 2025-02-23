import { Field, InputType, Float, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, MaxLength, IsBoolean, IsNumber, IsOptional, IsUrl } from "class-validator";

@InputType()
export class CreatePromotion {
    
    @Field(() => Int, { nullable: true }) // Se suele generar automáticamente
    @IsNumber()
    @IsOptional()
    id?: number;

    @Field(() => String)
    @IsString()
    @MaxLength(100) // Permitir nombres más largos si es necesario
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => Float) // GraphQL usa Float para valores decimales
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @Field(() => String, { nullable: true }) // URL de la imagen opcional
    @IsString()
    @IsUrl()
    @IsOptional()
    img?: string;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    endDate?: Date;

    @Field(() => Boolean)
    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

    @Field(() => Int)
    @IsNumber()
    @IsNotEmpty()
    promotionTypeId: number; // Relacionar con un tipo de promoción

    @Field(() => Int)
    @IsNumber()
    @IsNotEmpty()
    gymId: number;
}
