// src/category/category.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('gymId') gymId: number,

  ): Promise<Category> {
    return this.categoryService.createCategory(name, description,gymId);
  }

  
  @Query(() => [Category])
  async getAllCategories(
    @Args('gymId', { type: () => Number, nullable: true }) gymId?: number
  ): Promise<Category[]> {
    return this.categoryService.getAllCategories(gymId);
  }

  @Query(() => Category, { nullable: true })
  async getCategoryById(@Args('id') id: number): Promise<Category | null> {
    return this.categoryService.getCategoryById(id);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('description') description: string,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, name, description);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('id') id: number): Promise<boolean> {
    await this.categoryService.deleteCategory(id);
    return true;
  }
}
