import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async findByUser(user_id: number, requesting_user_id: number) {
    if (user_id !== requesting_user_id) {
      throw new ForbiddenException('You can only view your own wallet');
    }
    const wallet = await this.walletRepository.findOne({ where: { user_id } });
    if (!wallet)
      throw new NotFoundException(`Wallet for user ${user_id} not found`);
    return wallet;
  }

  async fund(user_id: number, amount: number, requesting_user_id: number) {
    if (user_id !== requesting_user_id) {
      throw new ForbiddenException('You can only fund your own wallet');
    }
    const wallet = await this.walletRepository.findOne({ where: { user_id } });
    if (!wallet)
      throw new NotFoundException(`Wallet for user ${user_id} not found`);
    wallet.available_balance = Number(wallet.available_balance) + amount;
    return this.walletRepository.save(wallet);
  }
}
