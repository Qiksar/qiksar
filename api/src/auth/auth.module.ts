import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import AuthController from './auth.controller';
import AuthService from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [HttpModule],
})
export default class AuthModule {}
