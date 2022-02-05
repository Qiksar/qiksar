import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  getHello(): string {
    return 'HELLO FROM THE TENANT SERVICE: YOU CALLED ';
  }
}
