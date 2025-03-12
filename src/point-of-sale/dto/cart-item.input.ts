import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, MaxLength, IsOptional, IsBoolean, IsInt } from 'class-validator';

@InputType()
export class CartItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => Int)
  costo: number;

  // ✅ Optional field to indicate if this is a membership item
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isMembership?: boolean;

  // ✅ Optional field to store the client ID associated with the membership
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idClienteTOMembership?: number;

    // ✅ Optional field to store the client ID associated with the membership
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    cashRegisterId?: number;
}



export interface CartItemModel {
  product: CartItemInput;
  quantity: number;
  total: number; // Required total for the item
}
  
