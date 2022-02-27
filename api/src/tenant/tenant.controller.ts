import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { Roles } from 'nest-keycloak-connect';

import { GetAdminAuthToken } from 'src/config/AuthConfig';
import AuthService from '../auth/auth.service';

@Controller({ path: 'tenant' })
export default class TenantController {
  constructor(private readonly authService: AuthService) {}

  /*
  @Get('/public')
  @Unprotected()
  getPublic(): string {
    return `${this.tenantService.getHello()} the public method`;
  }
  */

  /**
   * Create a user
   *
   * @param req incoming request
   * @param admin indicates if the user is to be an admin
   * @param username unique login id of the user
   * @param password initial password for the user
   * @param email email address of the user
   * @param firstname first name of the user
   * @param lastname last name of the user
   * @returns uuid of the user assigned by the auth server
   */
  @Post('create_user')
  @Roles({ roles: ['realm:tenant_admin'] })
  async createUser(
    @Req() req: Http2ServerRequest,
    @Body('admin') admin: boolean,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('temporary_password') temporary_password: boolean,
  ): Promise<Record<string, any>> {
    const token = this.authService.tokenFromRequest(req);
    const info = this.authService.getTokenInfo(token);
    const user = await this.authService.createUser(admin, info.realm, username, password, info.locale, email, firstname, lastname, temporary_password, token);

    return { userid: user };
  }

  /**
   * Delete a user
   *
   * @param req incoming request
   * @param userid unique id of the user
   */
  @Delete('delete_user')
  @Roles({ roles: ['realm:tenant_admin'] })
  async deleteUser(@Req() req: Http2ServerRequest, @Body('userid') userid: string): Promise<Record<string, any>> {
    const token = this.authService.tokenFromRequest(req);
    const { realm } = this.authService.getTokenInfo(token);

    await this.authService.deleteUser(realm, userid, token);

    return { userid };
  }

  /**
   * Create a tenant
   *
   * @param req incoming request
   * @param realm_name name of the tenant
   * @param locale default locale
   * @param username unique login id of the user
   * @param password initial password for the user
   * @param email email address of the user
   * @param firstname first name of the user
   * @param lastname last name of the user
   * @returns uuid of the user assigned by the auth server
   */
  @Post('create_tenant')
  @Roles({ roles: ['realm:tenant_admin'] })
  async createTenant(
    @Body('name') realm_name: string,
    @Body('locale') locale: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('temporary_password') temporary_password: boolean,
  ) {
    const token = await GetAdminAuthToken();

    await this.authService.createRealm(realm_name, token);
    await this.authService.createUser(true, realm_name, username, password, locale, email, firstname, lastname, temporary_password, token);
  }

  /**
   * Delete a tenant
   *
   * @param realm_name name of the tenant
   */
  @Delete('delete_tenant')
  @Roles({ roles: ['realm:tenant_admin'] })
  async deleteTenant(@Body('name') realm_name: string) {
    this.authService.deleteRealm(realm_name);
  }
}
