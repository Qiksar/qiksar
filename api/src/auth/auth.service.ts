import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';

import HttpHelper from 'src/common/HttpHelper';
import Validator from 'src/common/Validator';

@Injectable()
export default class AuthService {
  constructor(private readonly httpHelper: HttpHelper) {}

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
    const url = this.httpHelper.realmUrl(realm, 'protocol/openid-connect/token');
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
    const url = this.httpHelper.realmUrl(realm, 'protocol/openid-connect/userinfo');
    const my_details = await axios.get(url, this.httpHelper.buildHeader(token)).then((r: Record<string, any>) => r.data);

    return my_details;
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
    Validator.IsNotBlank(realm, 'realm must be specified')
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
      .post(this.httpHelper.realmAdminUrl(realm, 'users'), user, this.httpHelper.buildHeader(token))
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
      .get(this.httpHelper.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), this.httpHelper.buildHeader(token))
      .then(async (r) => {
        role = [this.getRoleByName(r.data, 'default-roles-' + realm)];
      })
      .catch((e) => {
        throw new HttpException(e.response.data['errorMessage'], 409);
      });

    // Delete the default role mapping
    await axios
      .delete(this.httpHelper.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), {
        data: role,
        headers: this.httpHelper.authHeader(token),
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

    await axios
      .post(this.httpHelper.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), required_role, this.httpHelper.buildHeader(token))
      .catch((e) => {
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
      .get(this.httpHelper.realmAdminUrl(realm, `roles`), this.httpHelper.buildHeader(token))
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
}
