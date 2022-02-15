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

  /**
   * Authenticate the user against a specified realm
   *
   * @param realm name of the realm
   * @param client name of the client
   * @param username unique login name of the user
   * @param password password in clear text
   * @returns full authentication result from the server
   */
  public async authenticate(realm: string, client: string, username: string, password: string): Promise<Record<string, any>> {
    const url = this.realmUrl(realm, 'protocol/openid-connect/token');
    const params = new URLSearchParams();
    params.append('client_id', client);
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');

    const r = await axios.post(url, params).then((r) => r.data);

    return r;
  }

  /**
   * Get details of the authenticated user
   *
   * @param realm source realm
   * @param token authentication token
   * @returns user details as provided by the server
   */
  public async me(realm: string, token: string): Promise<Record<string, any>> {
    const url = this.realmUrl(realm, 'protocol/openid-connect/userinfo');
    const r = await axios.get(url, this.buildHeader(token)).then((r: Record<string, any>) => r.data);

    return r;
  }

  /**
   * Create a new user and assign the required role
   *
   * @param admin indicates if the user is to be created as a realm admin
   * @param realm name of the realm
   * @param username unique login name of the user
   * @param password password in clear text
   * @param locale locale of the user
   * @param email email address of the user
   * @param firstName first name of the user
   * @param lastName last name of the user
   * @param token authentication token
   * @returns
   */
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

    let userid = '';

    // Create the new user
    await axios
      .post(this.realmAdminUrl(realm, 'users'), user, this.buildHeader(token))
      .then((r) => {
        userid = r.headers['location'].split('/')[8];
      })
      .catch((e) => {
        throw new HttpException(e.response.data['errorMessage'], 409);
      });

    // Get the default role assigned by Keycloak so we can delete it
    void this.deleteDefaultKeycloakRole(realm, userid, token);

    // Add the required role to the user
    await this.addUserRole(realm, admin, userid, token);

    // set required actions like review profile, reset password and OTP

    //console.log('New user created with ID: ' + userid);

    return userid;
  }

  //#region Role managment

  /**
   * Delete the role which Keycloak assigns by default when a user is created
   *
   * @param realm name of the realm
   * @param userid uuid of the user
   * @param token authentication token
   */
  private async deleteDefaultKeycloakRole(realm: string, userid: string, token: string): Promise<void> {
    let role = [];

    await axios
      .get(this.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), this.buildHeader(token))
      .then(async (r) => {
        role = [this.getRoleByName(r.data, 'default-roles-' + realm)];
      })
      .catch((e) => {
        throw new HttpException(e.response.data['errorMessage'], 409);
      });

    // Delete the default role mapping
    await axios
      .delete(this.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), {
        data: role,
        headers: this.authHeader(token),
      })
      .catch((e) => {
        throw new HttpException('Failed to delete default role\r' + JSON.stringify(e.response.data), e.response.status);
      });
  }

  /**
   * Add a realm role to the user
   *
   * @param realm name of the realm
   * @param admin indicates if the admin role is required
   * @param userid uuid of the user
   * @param token authentication token
   */
  private async addUserRole(realm: string, admin: boolean, userid: string, token: string) {
    const roles = await this.getRealmRoles(realm, token);
    const required_role = [this.getRoleByName(roles, admin ? 'tenant_admin' : 'tenant_user')];

    await axios.post(this.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), required_role, this.buildHeader(token)).catch((e) => {
      throw new HttpException('Failed to assign role to user\r' + JSON.stringify(e.response.data), e.response.status);
    });
  }

  /**
   * Get the list of roles available in the realm
   *
   * @param realm name of the realm
   * @param token authentication token
   * @returns Array of realm roles
   */
  public async getRealmRoles(realm: string, token: string): Promise<Array<Record<string, any>>> {
    let roles = [];

    await axios
      .get(this.realmAdminUrl(realm, `roles`), this.buildHeader(token))
      .then(async (r) => {
        roles = r.data;
      })
      .catch((e) => {
        throw new HttpException(e.response.data['errorMessage'], 409);
      });

    return roles;
  }

  /**
   * Get a role by name from an array of roles
   *
   * @param roles array of roles
   * @param role_name name of required role
   * @returns reprentation of a role
   */
  public getRoleByName(roles: Array<Record<string, any>>, role_name: string): Record<string, any> {
    let role = undefined;
    roles.map((r: Record<string, any>) => {
      if (r['name'] === role_name) role = r;
    });

    if (role) return role;

    throw `'${role_name}' is not a valid role`;
  }

  //#endregion

  //#region Token handling

  /**
   * Extract the authorization token from the request header
   *
   * @param req request object
   * @returns authorization token as a base64 encoded string
   */
  public tokenFromRequest(req: Http2ServerRequest): string {
    const token = req.headers['authorization']?.substring(7).trim();
    if (!token) throw new HttpException('Invalid token', 401);

    return token;
  }

  /**
   * Decode base64 encoded token
   *
   * @param token authorization token
   * @returns object with decoded token details
   */
  public decodeToken(token: string): Record<string, any> {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

  //#endregion

  //#region URL and header builder

  /**
   * Build a URL for access to a specific realm
   *
   * @param realm name of the realm
   * @param extensions additional path to append
   * @returns string with required URL
   */
  private realmUrl(realm: string, extensions: string): string {
    return `${this.config.authServerUrl}/realms/${realm}/${extensions}`;
  }

  /**
   * Build a URL for access to administer a specific realm
   *
   * @param realm name of the realm
   * @param extensions additional path to append
   * @returns string with required URL
   */
  private realmAdminUrl(realm: string, extension: string): string {
    return `${this.config.authServerUrl}/admin/realms/${realm}/${extension}`;
  }

  /**
   * Build a basic head for a HTTP request
   * @param token authorisation token
   * @returns object containg headers
   */
  private buildHeader(token: string): Record<string, any> {
    return { headers: this.authHeader(token) };
  }

  /**
   * Build a header containing the authorization token
   *
   * @param token authorization token
   * @returns authorization header
   */
  private authHeader(token: string): Record<string, any> {
    return { Authorization: `Bearer ${token}` };
  }

  //#endregion

  //#region Validation

  /**
   * Validate a username string
   *
   * @param username unique user name
   * @param error message to display if validation fails
   * @returns true if valid
   */
  private IsValidUsername(username: string, error: string): AuthService {
    if (!/^[0-9a-zA-Z_.-]+$/.test(username)) throw new HttpException(error, 409);

    return this;
  }

  /**
   * Validate an email string
   *
   * @param email email address of the user name
   * @param error message to display if validation fails
   * @returns true if valid
   */
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

  /**
   * Check a string for being zero length or undefined
   *
   * @param value string value to be validated, can accept undefined value
   * @param error message to display if validation fails
   * @returns true if valid
   */
  private IsNotBlank(value: string | undefined, error: string): AuthService {
    if (!value?.trim().length) throw new HttpException(error, 409);

    return this;
  }

  //#endregion
}
