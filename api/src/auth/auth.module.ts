import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import HttpHelper from 'src/common/HttpHelper';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HttpHelper],
  imports: [HttpModule],
})
export default class AuthModule {}
