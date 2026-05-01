import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query('recipient_id') recipient_id: string) {
    return this.notificationsService.findAll(+recipient_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      recipient_id: number;
      notification_type: string;
      title: string;
      message: string;
      transaction_id?: number;
      withdrawal_id?: number;
      refund_id?: number;
      channel?: string;
    },
  ) {
    return this.notificationsService.create(body);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(+id);
  }
}
