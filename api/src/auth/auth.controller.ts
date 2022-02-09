import { Body, Controller, Param, Post } from '@nestjs/common';
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
    
    console.log(`Token: ${JSON.stringify(token)}`);
    
    return token;
  }
}
