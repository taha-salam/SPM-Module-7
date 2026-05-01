import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund } from './refund.entity';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
  ) {}

  findAll() {
    return this.refundRepository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: number) {
    const refund = await this.refundRepository.findOne({ where: { id } });
    if (!refund) throw new NotFoundException(`Refund ${id} not found`);
    return refund;
  }

  async create(
    body: {
      transaction_id: number;
      escrow_id: number;
      milestone_payment_id?: number;
      requested_by: number;
      reason: string;
      refund_amount: number;
    },
    requesting_user_id: number,
  ) {
    if (body.requested_by !== requesting_user_id) {
      throw new ForbiddenException('You can only request refunds for yourself');
    }
    const refund = this.refundRepository.create(body);
    return this.refundRepository.save(refund);
  }

  async approve(id: number, admin_id: number) {
    const refund = await this.findOne(id);
    refund.status = 'approved';
    refund.approved_by_admin = admin_id;
    refund.resolved_at = new Date();
    return this.refundRepository.save(refund);
  }

  async reject(id: number, admin_id: number) {
    const refund = await this.findOne(id);
    refund.status = 'rejected';
    refund.approved_by_admin = admin_id;
    refund.resolved_at = new Date();
    return this.refundRepository.save(refund);
  }
}
