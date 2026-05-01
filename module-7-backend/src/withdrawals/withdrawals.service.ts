import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
  ) {}

  findAll() {
    return this.withdrawalRepository.find();
  }

  async findOne(id: number) {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);
    return withdrawal;
  }

  async create(
    body: {
      amount: number;
      payment_method_id: number;
      wallet_id: number;
      currency_code?: string;
    },
    requesting_user_id: number,
  ) {
    const fee = body.amount * 0.02;
    const net = body.amount - fee;
    const withdrawal = this.withdrawalRepository.create({
      user_id: requesting_user_id,
      wallet_id: body.wallet_id,
      payment_method_id: body.payment_method_id,
      amount: body.amount,
      processing_fee: fee,
      net_amount: net,
      currency_code: body.currency_code || 'USD',
      status: 'pending',
    });
    return this.withdrawalRepository.save(withdrawal);
  }

  async approve(id: number) {
    const withdrawal = await this.findOne(id);
    withdrawal.status = 'completed';
    withdrawal.processed_at = new Date();
    return this.withdrawalRepository.save(withdrawal);
  }

  async reject(id: number, admin_note: string) {
    const withdrawal = await this.findOne(id);
    withdrawal.status = 'rejected';
    withdrawal.admin_note = admin_note;
    withdrawal.processed_at = new Date();
    return this.withdrawalRepository.save(withdrawal);
  }
}
