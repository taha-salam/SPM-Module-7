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
import { WithdrawalsService } from './withdrawals.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get()
  findAll() {
    return this.withdrawalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawalsService.findOne(+id);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(
    @Body()
    body: {
      amount: number;
      payment_method_id: number;
      wallet_id: number;
      currency_code?: string;
    },
    @Headers('x-user-id') userId: string,
  ) {
    return this.withdrawalsService.create(body, +userId);
  }

  @Patch(':id/approve')
  @UseGuards(OwnershipGuard)
  approve(@Param('id') id: string) {
    return this.withdrawalsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(OwnershipGuard)
  reject(@Param('id') id: string, @Body() body: { admin_note: string }) {
    return this.withdrawalsService.reject(+id, body.admin_note);
  }
}
