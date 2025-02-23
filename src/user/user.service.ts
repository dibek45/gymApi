import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUser,CreateUser } from './dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsocketsGateway } from 'src/socket/gateway';
import { UpdateFingerPrintUserByID } from './dto/inputs/update-user.input.dto';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Injectable() 
export class UserService {

  private zideBicep:string="25s"

    constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private readonly websocketsGateway: WebsocketsGateway
    ){

    }
    
    async create(data: CreateUser): Promise<User> {
      const newUser = new User();
     
      newUser.name = data.name;
      newUser.actived = data.actived;
      newUser.huella = data.huella; 
      newUser.img = data.img; 
      newUser.gymId=data.gymId;
      newUser.available_days=666;
      const user = await this.userRepository.save(newUser);
      console.log(user.gymId)
      return user;
    }
    

    async findAll(): Promise<User[]> {
      return await this.userRepository.find();
      }


    async findAllByGymId(gymId: number, userId?: number): Promise<User[]> {
        const whereCondition: any = { gymId: gymId }; // Filtrar por gymId
    
        if (userId) {
            whereCondition.id = userId; // Agregar filtro por userId si existe
        }
    
        return await this.userRepository.find({
            where: whereCondition,
        });
    }
    findOneByGymAndUserId(gymId:number,id: number): Promise<User> {
      return this.userRepository.findOneBy( {gymId,id:id});
    }

      findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id:id});
      }

      async findByHuella(huella: string): Promise<User> {
        return this.userRepository.findOneBy({ huella:huella});
      }

      async update({ id, name, actived, img }: UpdateUser) {
        const user = await this.userRepository.findOneBy({id:id});
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        console.log("llega a actualizar");    user.name = name;
        user.actived = actived;
        user.img = img;
    
        return await this.userRepository.save(user);
    }


    async updateFingerPrint({ id, huella }: UpdateFingerPrintUserByID) {
      console.log("llega al servicio update fingerPrint")
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
    
      // Actualizar los campos necesarios
      user.huella = huella; // Actualizar el ID
    
      // Guardar y devolver el usuario actualizado
      return await this.userRepository.save(user);
    }
    
    async getStatus(id: number) {
      const user = await this.userRepository.findOneBy({id:id});
      if (!user) {
          throw new Error(`User with ID ${id} not found`);
      }
  
    
  
      return user
  }

  async deleteUser(id: number) {
    
    const user = await this.userRepository.findOneBy({id:id});
    if (!user) {
        throw new Error(`User with ID ${id} not found`);
    }

     await this.userRepository.delete({id:user.id});
    return     true
}

}
