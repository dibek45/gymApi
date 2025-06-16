import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsocketsGateway } from 'src/socket/gateway';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { UpdateProduct } from './dto/inputs/update-product.input.dto';
import { CreateProduct } from './dto/inputs/create-product-input.dto';
import { ImageService } from 'src/uploads/imgCustom';

@Injectable()
export class ProductService {

  private zideBicep: string = "25s";

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,       
     private _saveImage:ImageService,

  ) {}

  async create(data: CreateProduct): Promise<Product> {
    try {
      // 1️⃣ Crear una nueva instancia de Product
      const newProduct = new Product();
  
      // 2️⃣ Guardar la imagen y obtener la ruta del archivo
      const imagePath = await this._saveImage.saveBase64Image(data.img); // ⚠️ Usa la imagen desde "data.img"
      newProduct.img = imagePath; // 👈 Guarda la ruta de la imagen en la propiedad 'img'
  
      // 3️⃣ Asignar los demás campos del producto
      newProduct.name = data.name;
      newProduct.available = data.available;
      newProduct.stock = data.stock;
      newProduct.price = data.price;
      newProduct.categoryId = data.categoria_id;
      newProduct.gymId = 1;
      newProduct.img=(imagePath)
      newProduct.barcode = data.barcode;
  
      // 4️⃣ Guardar el producto en la base de datos
      const product = await this.productRepository.save(newProduct);
      console.log('✅ Producto creado con la categoría:', product.categoryId);
  
      return product;
  
    } catch (error) {
      console.error('❌ Error al crear el producto:', error.message);
      throw new Error('Error al crear el producto: ' + error.message);
    }
  }
  
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findAllByGymId(gymId: number, productId?: number): Promise<Product[]> {
    const whereCondition: any = { gymId: gymId };
    
    if (productId) {
      whereCondition.id = productId;
    }

    return await this.productRepository.find({
      where: whereCondition,
    });
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id: id });
  }

  async update({ id, name, available, img, stock, price, categoryId }: UpdateProduct) {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    console.log("llega a actualizar");

    if (name !== undefined) product.name = name;
    if (available !== undefined) product.available = available;
    if (img !== undefined) product.img = img;
    if (stock !== undefined) product.stock = stock;
    if (price !== undefined) product.price = price;
    if (categoryId !== undefined) product.categoryId = categoryId;

    return await this.productRepository.save(product);
  }

  async getStatus(id: number) {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete({ id: product.id });
    return true;
  }
}
