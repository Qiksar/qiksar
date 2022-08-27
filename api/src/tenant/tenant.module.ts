import { Module } from '@nestjs/common';

import TenantController from './tenant.controller';
import AuthService from '../auth/auth.service';
import HttpHelper from '../common/HttpHelper';

@Module({
  controllers: [TenantController],
  providers: [AuthService, HttpHelper],
})
export default class TenantModule {}
