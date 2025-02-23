import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { PubSub } from 'graphql-subscriptions';
import { Get } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { WebsocketsGateway } from 'src/socket/gateway';
import { CreateProduct } from './dto/inputs/create-product-input.dto';
import { UpdateProduct } from './dto/inputs/update-product.input.dto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ImageService } from 'src/uploads/imgCustom';

const pubSub = new PubSub();

@Resolver()
export class ProductResolver {
    constructor(
        private readonly _socketService: WebsocketsGateway,
        private readonly _product: ProductService,
    ) {}

    @Query(() => [Product], { name: 'productsByGymId' })
    async findAll(
        @Args('gymId', { type: () => Number }) gymId: number,
        @Args('productId', { nullable: true }) productId?: number
    ) {
        return this._product.findAllByGymId(gymId, productId);
    }

    @Query(() => Product, { name: 'product' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        console.log("entra a el resolver");
        const foundProduct = await this._product.findOne(id);
        console.log(foundProduct);

        return foundProduct;
    }


    

    @Mutation(() => Product, { name: "updateProductByDS" })
    updateInput(@Args('updateProduct') updateProduct: UpdateProduct) {
        return this._product.update(updateProduct);
    }

   
    @Mutation(() => Product, { name: "getStatusProduct" })
    getStatus(@Args('id', { type: () => Int }) id: number) {
        return this._product.getStatus(id);
    }

    @Mutation(() => Boolean, { name: "deleteProduct" })
    delete(@Args('id', { type: () => Int }) id: number) {
        return this._product.deleteProduct(id);
    }

    @Subscription(() => Product)
    newProduct() {
        return pubSub.asyncIterator('newProduct'); // Maneja la suscripción para el evento newProduct
    }


    @Query(() => String)
    async getName(): Promise<string> {
        return 'Coding by Anas';
    }


     
    



      
    @Mutation(() => Product, { name: "createProduct" })
    async createInput(@Args('createProduct') createProduct: CreateProduct) {
        console.log("llega a resolver createProduct");
        console.log(createProduct.gymId);
        return await this._product.create(createProduct);
    }
    
}
