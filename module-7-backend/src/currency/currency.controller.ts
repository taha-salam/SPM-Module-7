import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get('rate')
  findRate(@Query('base') base: string, @Query('target') target: string) {
    return this.currencyService.findRate(base, target);
  }

  @Post()
  create(
    @Body()
    body: {
      base_currency: string;
      target_currency: string;
      exchange_rate: number;
      source_api: string;
    },
  ) {
    return this.currencyService.create(body);
  }
}
