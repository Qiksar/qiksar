import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';
import axios from 'axios';
import { Http2ServerRequest } from 'http2';
import { Roles } from 'nest-keycloak-connect';
import HttpHelper from 'src/common/HttpHelper';
import Validator from 'src/common/Validator';
import { GetAdminAuthToken } from 'src/config/AuthConfig';
import getRealmDefinition from 'src/config/getRealmDefinition';
import getRealmDefinitionSettings from 'src/config/RealmDefinitionSettings';

import AuthService from '../auth/auth.service';

@Controller({ path: 'tenant' })
export default class TenantController {
  constructor(private readonly authService: AuthService, private readonly httpHelper: HttpHelper) {}

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
  ): Promise<Record<string, any>> {
    const token = this.authService.tokenFromRequest(req);
    const decoded = this.authService.decodeToken(token);

    // Realm is implicit, it is the same realm as the calling user
    const realm = decoded['https://hasura.io/jwt/claims']['x-hasura-realm-id'];
    const locale = decoded['locale'];

    const user = await this.authService.createUser(admin, realm, username, password, locale, email, firstname, lastname, token);

    return { userid: user };
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
  ) {
    const token = await GetAdminAuthToken();

    await this.createRealm(realm_name, token);
    //await this.authService.createUser(true, realm_name, username, password, locale, email, firstname, lastname, token);
  }

  public async createRealm(name: string, token: string): Promise<void> {
    Validator.IsNotBlank(name, 'name must be specified').IsNotBlank(token, 'token must be specified');

    const settings = getRealmDefinitionSettings();
    settings['KEYCLOAK_REALM'] = name;

    const realm = getRealmDefinition(settings);

    const url = `${this.httpHelper.baseServerUrl}/admin/realms`;
    console.log('POST URL: ' + url);
    console.log('Creating realm: ' + name);

    // Create the new user
    await axios
      .post(url, realm, this.httpHelper.buildHeader(token))
      .then(() => {
        //console.log(r.status);
      })
      .catch((e) => {
        console.log('Got error: ' + e);

        throw new HttpException(e.response.data['errorMessage'], 500);
      });
  }
}
