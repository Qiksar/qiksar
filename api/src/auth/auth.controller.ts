import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { Unprotected, Roles, RoleMatchingMode } from 'nest-keycloak-connect';

import HttpHelper from 'src/common/HttpHelper';
import { DefaultAuthClient } from 'src/config/AuthConfig';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AuthService from './auth.service';
import LoginDto from './dto/login.dto';

@Controller({ path: 'auth' })
export default class AuthController {
  constructor(private readonly authService: AuthService, private readonly httpHelper: HttpHelper) {}

  /**
   * Authenticate the user
   *
   * @returns access token as supplied by Keycloak
   **/
  @Post('login')
  @Unprotected()
  async login(@Body() body: LoginDto): Promise<Record<string, any>> {
    const token = await this.authService.authenticate(body.realm, DefaultAuthClient, body.username, body.password);

    //console.log(JSON.stringify(this.authService.decodeToken(token['access_token'])));

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
    const { realm } = this.authService.getTokenInfo(token);

    const details = await this.authService.me(realm, token);

    return details;
  }
}
