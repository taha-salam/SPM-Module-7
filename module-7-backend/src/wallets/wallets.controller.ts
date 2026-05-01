import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('user/:userId')
  @UseGuards(OwnershipGuard)
  findByUser(
    @Param('userId') userId: string,
    @Headers('x-user-id') requestingUserId: string,
  ) {
    return this.walletsService.findByUser(+userId, +requestingUserId);
  }

  @Post('fund')
  @UseGuards(OwnershipGuard)
  fund(
    @Body() body: { user_id: number; amount: number },
    @Headers('x-user-id') userId: string,
  ) {
    return this.walletsService.fund(body.user_id, body.amount, +userId);
  }
}
