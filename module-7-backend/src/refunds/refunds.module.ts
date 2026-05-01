import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { Refund } from './refund.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Refund])],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
