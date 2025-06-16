import { Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, MaxLength, IsBoolean, IsInt, IsNumber, IsOptional } from "class-validator";

@InputType()
export class UpdateProduct {

    @Field(() => Number, { description: "Int", nullable: false })
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @Field(() => String, { description: "Name", nullable: true })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @Field(() => Boolean, { description: "Available", nullable: true })
    @IsBoolean()
    @IsOptional()
    available?: boolean;

    @Field(() => String, { description: "img", nullable: true })
    @IsString()
    @IsOptional()
    img?: string;

    @Field(() => Number, { description: "Stock", nullable: true })
    @IsNumber()
    @IsOptional()
    stock?: number;

    @Field(() => Number, { description: "Price", nullable: true })
    @IsNumber()
    @IsOptional()
    price?: number;

    @Field(() => Number, { description: "categoryId", nullable: true })
    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @Field(() => Number, { description: "gymId", nullable: true })
    @IsNumber()
    @IsOptional()
    gymId?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    barcode?: string;
}

