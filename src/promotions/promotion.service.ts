import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromotion } from './dto/inputs/create-promotion-input.dto';
import { UpdatePromotion } from './dto/inputs/update-promotion.input.dto';
import { PromotionType } from './type-promotion.entity';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion) private readonly promotionRepository: Repository<Promotion>,
        @InjectRepository(PromotionType)    private readonly promotionTypeRepository: Repository<PromotionType>,    ) {}

    /**
     * Create a new promotion
     * @param data - The data for creating the promotion
     * @returns The created promotion
     */
    async create(data: CreatePromotion): Promise<Promotion> {
        const newPromotion = this.promotionRepository.create(data);
        return await this.promotionRepository.save(newPromotion);
    }

    /**
     * Get all promotions
     * @returns List of promotions
     */
    async findAll(gymId?: number): Promise<Promotion[]> {
        if (gymId) {
          // Filtrar por gymId
          return await this.promotionRepository.find({ where: { gymId } });
        }
        // Retornar todas las promociones si no se especifica gymId
        return await this.promotionRepository.find();
      }

    /**
     * Get a promotion by ID
     * @param id - The ID of the promotion
     * @returns The promotion if found
     * @throws NotFoundException if the promotion does not exist
     */
    async findOne(id: number): Promise<Promotion> {
        const promotion = await this.promotionRepository.findOneBy({ id });
        if (!promotion) {
            throw new NotFoundException(`Promotion with ID ${id} not found`);
        }
        return promotion;
    }

    /**
     * Update a promotion
     * @param updateData - The data to update the promotion
     * @returns The updated promotion
     * @throws NotFoundException if the promotion does not exist
     */
    async update(updatePromotion: UpdatePromotion): Promise<Promotion> {
        const { id, ...updates } = updatePromotion;
      
        // Busca la promoción por ID
        const promotion = await this.promotionRepository.findOneBy({ id });
      
        if (!promotion) {
          throw new Error(`Promotion with ID ${id} not found`);
        }
      
        // Actualiza los campos proporcionados en `updatePromotion`
        Object.assign(promotion, updates);
      
        // Guarda los cambios en la base de datos
        return await this.promotionRepository.save(promotion);
      }
      

    /**
     * Delete a promotion by ID
     * @param id - The ID of the promotion
     * @returns True if the promotion was deleted successfully
     * @throws NotFoundException if the promotion does not exist
     */
    async deletePromotion(id: number): Promise<boolean> {
        const promotion = await this.promotionRepository.findOneBy({ id });
        if (!promotion) {
            throw new NotFoundException(`Promotion with ID ${id} not found`);
        }

        await this.promotionRepository.delete({ id: promotion.id });
        return true;
    }


    async getTypePromotionandPromotion(): Promise<PromotionType[]> {
        return this.promotionTypeRepository.find({
          relations: ['promotions'], // Relación con las promociones
        });
      }
}
