import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, MaxLength, IsBoolean, IsUrl, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdatePromotion {
    @Field(() => Int)
    @IsNumber()
    id: number; // ID obligatorio para identificar la promoción a actualizar

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    endDate?: Date;

    @Field(() => Float, { nullable: true }) // Se usa Float en GraphQL para valores decimales
    @IsNumber()
    @IsOptional()
    price?: number; // Nuevo campo para actualizar el precio

    @Field(() => String, { nullable: true })
    @IsString()
    @IsUrl()
    @IsOptional()
    img?: string; // Nuevo campo para actualizar la URL de la imagen


    @Field(() => Int)
    @IsNumber()
    @IsNotEmpty()
    promotionTypeId: number; // Relacionar con un tipo de promoción
}
