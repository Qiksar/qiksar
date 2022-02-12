import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

import AuthConfig from '../config/AuthConfig';
import { KeycloakConnectConfig } from 'nest-keycloak-connect';
import { Http2ServerRequest } from 'http2';

@Injectable()
export default class AuthService {
  private config: KeycloakConnectConfig;

  constructor() {
    this.config = AuthConfig;
  }

  public async authenticate(realm: string, client: string, user: string, password: string): Promise<Record<string, any>> {
    const url = this.realmUrl(realm, 'protocol/openid-connect/token');
    const params = new URLSearchParams();
    params.append('client_id', client);
    params.append('username', user);
    params.append('password', password);
    params.append('grant_type', 'password');

    const r = await axios.post(url, params).then((r) => r.data);

    return r;
  }

  public async me(realm: string, token: string): Promise<Record<string, any>> {
    const url = this.realmUrl(realm, 'protocol/openid-connect/userinfo');
    const r = await axios.get(url, this.buildHeader(token)).then((r: Record<string, any>) => r.data);

    return r;
  }

  public async createUser(
    admin: boolean,
    realm: string,
    username: string,
    password: string,
    locale: string,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
  ): Promise<string> {
    this.IsNotBlank(realm, 'realm must be specified')
      .IsNotBlank(username, 'username must be specified')
      .IsNotBlank(password, 'password must specify a temporary value for user password')
      .IsNotBlank(locale, 'locale must be specified')
      .IsNotBlank(email, 'email must be specified')
      .IsNotBlank(firstName, 'first name must be specified')
      .IsNotBlank(lastName, 'last name must be specified')
      .IsNotBlank(token, 'token must be specified')
      .IsValidUsername(username, 'username is invalid')
      .IsValidEmail(email, 'email is invalid');

    const user = {
      username,
      firstName,
      lastName,
      email,
      enabled: 'true',
      credentials: [{ type: 'password', value: password, temporary: true }],
      attributes: {
        tenant_id: realm,
        tenant_role: admin ? 'tenant_admin' : 'tenant_user',
        locale: locale,
      },
    };

    const url = this.adminUrl(realm, 'users');
    let userid = '';

    await axios
      .post(url, user, this.buildHeader(token))
      .then((r) => {
        userid = r.headers['location'].split('/')[8];
      })
      .catch((e) => {
        throw new HttpException(e.response.data['errorMessage'], 409);
      });

    // set required actions like review profile, reset password and OTP

    return userid;
  }

  public tokenFromRequest(req: Http2ServerRequest): string {
    const token = req.headers['authorization']?.substring(7).trim();
    if (!token) throw new HttpException('Invalid token', 401);

    return token;
  }

  public decodeToken(token: string): Record<string, any> {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

  private realmUrl(realm: string, action: string): string {
    return `${this.config.authServerUrl}/realms/${realm}/${action}`;
  }

  private adminUrl(realm: string, action: string): string {
    return `${this.config.authServerUrl}/admin/realms/${realm}/${action}`;
  }

  private buildHeader(token: string): Record<string, any> {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  //#region Validation

  private IsValidUsername(username: string, error: string): AuthService {
    if (!/^[0-9a-zA-Z_.-]+$/.test(username)) throw new HttpException(error, 409);

    return this;
  }

  private IsValidEmail(email: string, error: string): AuthService {
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
    )
      throw new HttpException(error, 409);

    return this;
  }

  private IsNotBlank(value: string, error: string): AuthService {
    if (!value?.trim().length) throw new HttpException(error, 409);

    return this;
  }

  //#endregion
}
