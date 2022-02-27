import { Injectable } from '@nestjs/common';
import { KeycloakConnectConfig } from 'nest-keycloak-connect';
import AuthConfig from '../config/AuthConfig';

/**
 * Helper class for extracting data from requests and tokens
 */
@Injectable()
export default class HttpHelper {
  private config: KeycloakConnectConfig;

  constructor() {
    this.config = AuthConfig;
  }

  /**
   * Get the Keycloak connector configuration
   */
  get Config(): KeycloakConnectConfig {
    return this.config;
  }

  /**
   * Get the base address to the Keycloak API
   */
  public get baseServerUrl(): string {
    return this.config.authServerUrl;
  }

  /**
   * Build a URL for access to administer a specific realm
   *
   * @param realm name of the realm
   * @param extensions additional path to append
   * @returns string with required URL
   */
  public realmAdminUrl(realm: string, extension?: string): string {
    const ext = extension ? `/${extension}` : '';
    const url = `${this.baseServerUrl}/admin/realms/${realm}` + ext;

    return url;
  }

  /**
   * Build a URL for access to a specific realm
   *
   * @param realm name of the realm
   * @param extensions additional path to append
   * @returns string with required URL
   */
  public realmUrl(realm: string, extensions: string): string {
    return `${this.baseServerUrl}/realms/${realm}/${extensions}`;
  }

  /**
   * Build a basic head for a HTTP request
   * @param token authorisation token
   * @returns object containg headers
   */
  public buildHeader(token: string): Record<string, any> {
    return { headers: this.authHeader(token) };
  }

  /**
   * Build a header containing the authorization token
   *
   * @param token authorization token
   * @returns authorization header
   */
  public authHeader(token: string): Record<string, any> {
    return { Authorization: `Bearer ${token}` };
  }
}
