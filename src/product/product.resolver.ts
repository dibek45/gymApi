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
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';
import { AppGateway } from 'src/app.gateway';


@Resolver()
export class ProductResolver {
  constructor(
    private readonly _socketService: AppGateway,
    private readonly _product: ProductService
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
    const foundProduct = await this._product.findOne(id);
    return foundProduct;
  }

  @AutoTouchVersion('products')
  @Mutation(() => Product, { name: "updateProductByDS" })
  async updateInput(@Args('updateProduct') updateProduct: UpdateProduct) {
    const updatedProduct = await this._product.update(updateProduct);
    this._socketService.emitProductUpdate(updatedProduct); // ✅ emite a la sala correcta
    return updatedProduct;
  }

  @AutoTouchVersion('products')
  @Mutation(() => Product, { name: "getStatusProduct" })
  async getStatus(@Args('id', { type: () => Int }) id: number) {
    const updated = await this._product.getStatus(id);
    this._socketService.emitProductUpdate(updated); // ✅ emite a la sala correcta
    return updated;
  }

  @AutoTouchVersion('products')
  @Mutation(() => Boolean, { name: "deleteProduct" })
  async delete(@Args('id', { type: () => Int }) id: number) {
    const deleted = await this._product.deleteProduct(id);
    // Opcional: emitir un evento si quieres notificar el borrado
    return deleted;
  }

@AutoTouchVersion('products')
  @Mutation(() => Product, { name: "createProduct" })
  async createInput(@Args('createProduct') createProduct: CreateProduct) {
    const newProduct = await this._product.create(createProduct);
    this._socketService.emitProductUpdate(newProduct); // ✅ emite a la sala correcta
    return newProduct;
  }

  @Query(() => String)
  async getName(): Promise<string> {
    return 'Coding by Anas';
  }
}
