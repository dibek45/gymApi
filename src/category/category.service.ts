// src/category/category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(name: string, description: string, gymId:number): Promise<Category> {
    const category = this.categoryRepository.create({ name, description, gymId:gymId });
    return this.categoryRepository.save(category);
  }

  async getAllCategories(gymId?: number): Promise<Category[]> {
    if (gymId) {
      // Filtrar las categorías por gymId
      return this.categoryRepository.find({ where: { gymId } });
    }
    // Si no se pasa gymId, devuelve todas las categorías
    return this.categoryRepository.find();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  async updateCategory(id: number, name: string, description: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new Error('Category not found');
    category.name = name;
    category.description = description;
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
