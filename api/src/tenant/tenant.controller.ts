import { Controller, Get } from '@nestjs/common';
import { Roles, Unprotected } from 'nest-keycloak-connect';

import TenantService from './tenant.service';

@Controller({ path: 'tenant' })
export default class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get('/public')
  @Unprotected()
  getPublic(): string {
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
