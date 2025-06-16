import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from './checkin.entity';
import { CreateCheckinInput } from './dto/inputs/create-checkin-input.dto';
import { UpdateCheckinInput } from './dto/inputs/update-checkin.input.dto';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepository: Repository<Checkin>
  ) {}

  async create(data: CreateCheckinInput): Promise<Checkin> {
    const newCheckin = this.checkinRepository.create({
      ...data,
      createdAt: new Date(),
    });

    return await this.checkinRepository.save(newCheckin);
  }

  async findAllByGym(gymId: number): Promise<Checkin[]> {
    return await this.checkinRepository.find({
      where: { gymId },
      order: { timestamp: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Checkin> {
    const checkin = await this.checkinRepository.findOneBy({ id });
    if (!checkin) throw new NotFoundException(`Check-in con ID ${id} no encontrado`);
    return checkin;
  }

  async update(data: UpdateCheckinInput): Promise<Checkin> {
    const checkin = await this.checkinRepository.findOneBy({ id: data.id });
    if (!checkin) throw new NotFoundException(`Check-in con ID ${data.id} no encontrado`);

    const updated = this.checkinRepository.merge(checkin, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    return await this.checkinRepository.save(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checkinRepository.delete({ id });
    return result.affected > 0;
  }
}
