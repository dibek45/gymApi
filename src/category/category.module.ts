// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Registro del repositorio Category
  providers: [CategoryService, CategoryResolver],
  exports: [TypeOrmModule], // Exporta TypeOrmModule para que Category esté disponible en otros módulos
})
export class CategoryModule {}
