import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleInput } from './dto/inputs/create-role.input';
import { AssignPermissionsInput } from './dto/inputs/assign-permissions.input';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const role = this.rolesRepository.create(createRoleInput);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<{ roles: Role[]; allPermissions: Permission[] }> {
    const roles = await this.rolesRepository.find({ relations: ['permissions'] });
    const allPermissions = await this.permissionsRepository.find(); // ✅ Traer todos los permisos existentes
  
    return { roles, allPermissions }; // ✅ Retornar ambos conjuntos de datos
  }
  

  async assignPermissions(assignPermissionsInput: AssignPermissionsInput): Promise<Role> {
    const { roleId, permissionIds } = assignPermissionsInput; // 👈 Extraer los valores correctamente
  
    const role = await this.rolesRepository.findOne({ 
      where: { id: roleId }, 
      relations: ['permissions'] 
    });
  
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
  
    const permissions = await this.permissionsRepository.findByIds(permissionIds);
  
    role.permissions = permissions;
    return this.rolesRepository.save(role);
  }
  
}
