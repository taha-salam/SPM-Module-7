import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escrow } from './escrow.entity';

@Injectable()
export class EscrowService {
  constructor(
    @InjectRepository(Escrow)
    private escrowRepository: Repository<Escrow>,
  ) {}

  findAll() {
    return this.escrowRepository.find();
  }

  async findOne(id: number) {
    const escrow = await this.escrowRepository.findOne({ where: { id } });
    if (!escrow) throw new NotFoundException(`Escrow ${id} not found`);
    return escrow;
  }

  async findByProject(project_id: number) {
    const escrow = await this.escrowRepository.findOne({
      where: { project_id },
    });
    if (!escrow)
      throw new NotFoundException(`Escrow for project ${project_id} not found`);
    return escrow;
  }

  async create(body: {
    project_id: number;
    client_user_id: number;
    freelancer_user_id: number;
    currency_code: string;
    total_amount: number;
  }) {
    const escrow = this.escrowRepository.create({
      ...body,
      escrow_status: 'pending',
    });
    return this.escrowRepository.save(escrow);
  }

  async fund(id: number, amount: number, requesting_user_id: number) {
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can fund this escrow');
    }
    escrow.funded_amount = Number(escrow.funded_amount) + amount;
    escrow.escrow_status = 'active';
    escrow.funded_at = new Date();
    return this.escrowRepository.save(escrow);
  }

  async freeze(id: number, requesting_user_id: number) {
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can freeze this escrow');
    }
    escrow.escrow_status = 'frozen';
    return this.escrowRepository.save(escrow);
  }

  async close(id: number, requesting_user_id: number) {
    const escrow = await this.findOne(id);
    if (escrow.client_user_id !== requesting_user_id) {
      throw new ForbiddenException('Only the client can close this escrow');
    }
    escrow.escrow_status = 'completed';
    escrow.closed_at = new Date();
    return this.escrowRepository.save(escrow);
  }
}
