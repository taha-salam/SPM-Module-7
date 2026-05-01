import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query('user_id') user_id: string) {
    return this.invoicesService.findAll(+user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      milestone_payment_id: number;
      project_id: number;
      client_user_id: number;
      freelancer_user_id: number;
      gross_amount: number;
      platform_fee?: number;
      tax_amount?: number;
      currency_code: string;
    },
  ) {
    return this.invoicesService.create(body);
  }
}
