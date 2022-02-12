import { Module } from '@nestjs/common';
import AuthService from 'src/auth/auth.service';

import TenantController from './tenant.controller';
import TenantService from './tenant.service';

@Module({
  controllers: [TenantController],
  providers: [AuthService, TenantService],
})
export default class TenantModule {}
