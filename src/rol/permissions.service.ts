import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/inputs/create-permission.input';
import { UpdatePermissionInput } from './dto/inputs/update-permission.input';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionInput: CreatePermissionInput): Promise<Permission> {
    const permission = this.permissionsRepository.create(createPermissionInput);
    return this.permissionsRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({ order: {
      category: 'ASC', // Ordena por categoría alfabéticamente
      name: 'ASC' // Ordena los permisos dentro de cada categoría
    }});
  }

  async findByGym(gymId: number): Promise<Permission[]> {
    return this.permissionsRepository.find({ where: { gymId } });
  }

  async update(updatePermissionInput: UpdatePermissionInput): Promise<Permission> {
    const { id, name, description } = updatePermissionInput;

    const permission = await this.permissionsRepository.findOne({ where: { id } });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    if (name) permission.name = name;
    if (description) permission.description = description;

    return this.permissionsRepository.save(permission);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.permissionsRepository.delete(id);
    return result.affected > 0;
  }
}
