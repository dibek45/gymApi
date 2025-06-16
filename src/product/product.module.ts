import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketsGateway } from 'src/socket/gateway';
import { Category } from 'src/category/category.entity';
import { ImageService } from 'src/uploads/imgCustom';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [ProductResolver, ProductService, WebsocketsGateway,ImageService,AppGateway],
  imports: [
    TypeOrmModule.forFeature([Product,Category]),
  ]
})
export class ProductModule {}
