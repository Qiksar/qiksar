import { Injectable } from '@nestjs/common';
import axios from 'axios';

import AuthConfig from '../config/AuthConfig';
import { KeycloakConnectConfig } from 'nest-keycloak-connect';

@Injectable()
export default class AuthService {
  private config: KeycloakConnectConfig;

  constructor() {
    this.config = AuthConfig;
  }

  public async authenticate(realm: string, client: string, user: string, password: string): Promise<Record<string, any>> {
    const url = this.url(realm, 'protocol/openid-connect/token');
    const params = new URLSearchParams();
    params.append('client_id', client);
    params.append('username', user);
    params.append('password', password);
    params.append('grant_type', 'password');

    const r = await axios.post(url, params).then((r) => r.data);

    return r;
  }

  public async me(realm: string, token: string): Promise<Record<string, any>> {
    const params = new URLSearchParams();
    const url = this.url(realm, 'protocol/openid-connect/userinfo');
    const r = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

    return r;
  }

  private url(realm: string, action: string): string {
    return `${this.config.authServerUrl}/realms/${realm}/${action}`;
  }
}
