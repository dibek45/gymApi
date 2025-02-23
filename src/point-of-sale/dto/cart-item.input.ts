// src/point-of-sale/dto/cart-item.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

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
}




export interface CartItemModel {
  product: CartItemInput;
  quantity: number;
  total: number; // Required total for the item
}
  
