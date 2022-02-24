import { Module } from '@nestjs/common';

import TenantController from './tenant.controller';
import AuthService from 'src/auth/auth.service';
import HttpHelper from 'src/common/HttpHelper';

@Module({
  controllers: [TenantController],
  providers: [AuthService, HttpHelper],
})
export default class TenantModule {}
