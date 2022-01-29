import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [ConfigModule],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
