import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { Unprotected, Roles, RoleMatchingMode } from 'nest-keycloak-connect';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AuthService from './auth.service';

@Controller({ path: 'auth' })
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Authenticate the user
   *
   * @returns access token as supplied by Keycloak
   **/
  @Post('login')
  @Unprotected()
  async login(
    @Body('realm') realm: string,
    @Body('client_id') client_id: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<Record<string, any>> {
    const token = await this.authService.authenticate(realm, client_id, username, password);

    console.log(JSON.stringify(this.authService.decodeToken(token['access_token'])));

    return token;
  }

  /**
   * Get details of the authenticated user
   *
   * @param req incoming request
   * @returns details as provided by the auth server
   */
  @Get('me')
  @Roles({ roles: ['realm:tenant_admin', 'realm:tenant_user'], mode: RoleMatchingMode.ANY })
  async me(@Req() req: Http2ServerRequest): Promise<Record<string, any>> {
    const token = this.authService.tokenFromRequest(req);
    const decoded = this.authService.decodeToken(token);
    const realm = decoded['https://hasura.io/jwt/claims']['x-hasura-realm-id'];

    const details = await this.authService.me(realm, token);

    return details;
  }
}
