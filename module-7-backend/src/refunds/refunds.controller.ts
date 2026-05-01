import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  findAll() {
    return this.refundsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(
    @Body()
    body: {
      transaction_id: number;
      escrow_id: number;
      milestone_payment_id?: number;
      requested_by: number;
      reason: string;
      refund_amount: number;
    },
    @Headers('x-user-id') userId: string,
  ) {
    return this.refundsService.create(body, +userId);
  }

  @Patch(':id/approve')
  @UseGuards(OwnershipGuard)
  approve(@Param('id') id: string, @Body() body: { admin_id: number }) {
    return this.refundsService.approve(+id, body.admin_id);
  }

  @Patch(':id/reject')
  @UseGuards(OwnershipGuard)
  reject(@Param('id') id: string, @Body() body: { admin_id: number }) {
    return this.refundsService.reject(+id, body.admin_id);
  }
}
