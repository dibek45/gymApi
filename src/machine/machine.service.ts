import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { Qr } from './entities/qr.entity';
import { CreateMachineInput } from './dto/create-machine.input';
import { UpdateMachineInput } from './dto/update-machine.input';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,

    @InjectRepository(Qr)
    private readonly qrRepository: Repository<Qr>,
  ) {}

  async create(createMachineInput: CreateMachineInput): Promise<Machine> {
    const { qrs, ...machineData } = createMachineInput;

    const machine = this.machineRepository.create(machineData);
    const savedMachine = await this.machineRepository.save(machine);

    if (qrs?.length) {
      const qrEntities = qrs.map((qr) =>
        this.qrRepository.create({ ...qr, machineId: savedMachine.id }),
      );
      await this.qrRepository.save(qrEntities);
      savedMachine.qrs = qrEntities;
    }

    return savedMachine;
  }
  async findAllByGym(gymId: number): Promise<Machine[]> {
    return this.machineRepository.find({
      where: { gymId },               // 🔍 Filtra por gymId
      relations: ['qrs'],             // 🟦 Incluye los QR en la respuesta
      order: { id: 'ASC' }            // Opcional: ordena por id ascendente
    });
  }
  
  async findOne(id: number): Promise<Machine> {
    const machine = await this.machineRepository.findOne({
      where: { id },
      relations: ['qrs'],
    });
    if (!machine) throw new NotFoundException(`Machine ${id} not found`);
    return machine;
  }
  async update(id: number, updateMachineInput: UpdateMachineInput): Promise<Machine> {
    const machine = await this.machineRepository.findOne({ where: { id } });
  
    if (!machine) {
      throw new NotFoundException(`Machine #${id} not found`);
    }
  
    const updatedMachine = this.machineRepository.merge(machine, updateMachineInput);
  
    return this.machineRepository.save(updatedMachine);
  }
  

  async remove(id: number): Promise<Machine> {
    const machine = await this.findOne(id);
    await this.machineRepository.delete(id);
    return machine;
  }
}
