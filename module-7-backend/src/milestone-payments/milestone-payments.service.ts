import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestonePayment } from './milestone-payment.entity';

@Injectable()
export class MilestonePaymentsService {
  constructor(
    @InjectRepository(MilestonePayment)
    private milestonePaymentRepository: Repository<MilestonePayment>,
  ) {}

  findAll(escrow_id: number) {
    return this.milestonePaymentRepository.find({ where: { escrow_id } });
  }

  async findOne(id: number) {
    const payment = await this.milestonePaymentRepository.findOne({
      where: { id },
    });
    if (!payment)
      throw new NotFoundException(`Milestone payment ${id} not found`);
    return payment;
  }

  async create(body: {
    escrow_id: number;
    milestone_id: number;
    title: string;
    amount: number;
    due_date?: Date;
  }) {
    const payment = this.milestonePaymentRepository.create(body);
    return this.milestonePaymentRepository.save(payment);
  }

  async approve(id: number) {
    const payment = await this.findOne(id);
    payment.approval_status = 'approved';
    payment.approved_at = new Date();
    return this.milestonePaymentRepository.save(payment);
  }

  async reject(id: number) {
    const payment = await this.findOne(id);
    payment.approval_status = 'rejected';
    return this.milestonePaymentRepository.save(payment);
  }

  async release(id: number) {
    const payment = await this.findOne(id);
    payment.release_status = 'released';
    payment.released_at = new Date();
    return this.milestonePaymentRepository.save(payment);
  }
}
