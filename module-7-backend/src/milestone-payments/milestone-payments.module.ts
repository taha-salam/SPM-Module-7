import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonePaymentsController } from './milestone-payments.controller';
import { MilestonePaymentsService } from './milestone-payments.service';
import { MilestonePayment } from './milestone-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MilestonePayment])],
  controllers: [MilestonePaymentsController],
  providers: [MilestonePaymentsService],
})
export class MilestonePaymentsModule {}
