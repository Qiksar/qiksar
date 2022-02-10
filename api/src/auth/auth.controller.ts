import { Body, Controller, Get, HttpException, Param, Post, Req } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { Unprotected } from 'nest-keycloak-connect';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AuthService from './auth.service';

@Controller({ path: 'auth' })
export default class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  /**
   * Authenticate the user
   *
   * @returns access token as supplied by Keycloak
   **/
  @Post('login')
  @Unprotected()
  async auth(
    @Body('realm') realm: string,
    @Body('client_id') client_id: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<Record<string, any>> {
    const token = await this.AuthService.authenticate(realm, client_id, username, password);

    return token;
  }

  @Get('me')
  async me(@Req() req: Http2ServerRequest, @Body('realm') realm: string): Promise<Record<string, any>> {
    const token = req.headers['authorization']?.substring(7).trim();

    if (!token) throw new HttpException('Invalid token', 401);

    const details = await this.AuthService.me(realm, token);

    return details;
  }
}
