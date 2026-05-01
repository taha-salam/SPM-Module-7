import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll(@Query('user_id') user_id: string) {
    return this.paymentMethodsService.findAll(+user_id);
  }

  @Post()
  create(
    @Body()
    body: {
      user_id: number;
      method_type: string;
      provider_name: string;
      account_title: string;
      account_number_masked: string;
      iban_or_wallet_id: string;
      country_code: string;
    },
  ) {
    return this.paymentMethodsService.create(body);
  }

  @Patch(':id/set-default')
  setDefault(@Param('id') id: string, @Body() body: { user_id: number }) {
    return this.paymentMethodsService.setDefault(+id, body.user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
}
