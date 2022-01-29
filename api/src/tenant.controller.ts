import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Roles, Unprotected } from 'nest-keycloak-connect';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get('/public')
  @Unprotected()
  getpublic(): string {
    return `${this.tenantService.getHello()} the public method`;
  }
  @Get('/current_tenant')
  @Roles({ roles: ['realm:tenant_admin'] })
  getCurrentTenant(): string {
    return `${this.tenantService.getHello()} the current_tenant method`;
  }
  @Get('/current_user')
  @Roles({ roles: ['realm:tenant_user', 'realm:tenant_admin'] })
  getCurrentUser(): string {
    return `${this.tenantService.getHello()} the current_user method`;
  }
}
