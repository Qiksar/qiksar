import { Module } from '@nestjs/common';

import TenantController from './tenant.controller';
import TenantService from './tenant.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
})
export default class TenantModule {}
