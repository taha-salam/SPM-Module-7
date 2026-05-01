import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { Escrow } from './escrow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Escrow])],
  controllers: [EscrowController],
  providers: [EscrowService],
})
export class EscrowModule {}
