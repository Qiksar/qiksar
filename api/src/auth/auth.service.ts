import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';

import HttpHelper from 'src/common/HttpHelper';
import DataTypeValidator from 'src/common/DataTypeValidator';

import getRealmDefinition from 'src/config/getRealmDefinition';
import { GetAdminAuthToken } from 'src/config/AuthConfig';
import CreateUserDto from 'src/tenant/dto/create_user.dto';

@Injectable()
export default class AuthService {
  constructor(private readonly httpHelper: HttpHelper) {}

  /**
   * Authenticate the user against a specified realm
   *
   * @param realm name of the realm
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

    const r = await axios
      .post(url, params)
      .then((r) => r.data)
      .catch((e) => {
        throw new HttpException(`login failed: ${e.response.data.error_description}`, e.response.status);
      });

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
    const my_details = await axios
      .get(url, this.httpHelper.buildHeader(token))
      .then((r: Record<string, any>) => r.data)
      .catch((e) => {
        throw new HttpException(`failed to retrieve user details: ${e.response.data.error_description}`, e.response.status);
      });

    return my_details;
  }

  /**
   * Create a new user and assign the required role
   *
   * @param user user DTO
   * @param realm name of the realm
   * @param locale locale of the user
   * @param token authentication token
   * @returns uuid of user
   */
  public async createUser(user: CreateUserDto, realm: string, locale: string, token: string): Promise<string> {
    const newUser = {
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      enabled: 'true',
      credentials: [{ type: 'password', value: user.password, temporary: user.temporary_password }],
      attributes: {
        tenant_id: realm,
        tenant_role: user.admin ? 'tenant_admin' : 'tenant_user',
        locale: locale,
      },
    };

    let userid = '';

    // Create the new user
    await axios
      .post(this.httpHelper.realmAdminUrl(realm, 'users'), newUser, this.httpHelper.buildHeader(token))
      .then((r) => {
        userid = r.headers['location'].split('/')[8];
      })
      .catch((e) => {
        console.log(e.response);
        throw new HttpException(`failed to create user: ${e.response.data.error_description}`, e.response.status);
      });

    // Get the default role assigned by Keycloak so we can delete it
    void this.deleteDefaultKeycloakRole(realm, userid, token);

    // Add the required role to the user
    await this.addUserRole(realm, user.admin, userid, token);

    //console.log('New user created with ID: ' + userid);

    return userid;
  }

  /**
   * Delete user
   *
   * @param realm name of the realm
   * @param userid unique id of the user
   * @param token authentication token
   */
  public async deleteUser(realm: string, userid: string, token: string): Promise<void> {
    DataTypeValidator.IsNotBlank(realm, 'realm must be specified')
      .IsValidUsername(userid, 'userid must be specified')
      .IsNotBlank(token, 'token must be specified');

    // Delete the new user
    await axios.delete(this.httpHelper.realmAdminUrl(realm, 'users/' + userid), this.httpHelper.buildHeader(token)).catch((e) => {
      console.log(e.response);
      throw new HttpException(`failed to delete user: ${e.response.data.error}`, e.response.status);
    });
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

    // Get the default role mapping
    await axios
      .get(this.httpHelper.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), this.httpHelper.buildHeader(token))
      .then(async (r) => {
        role = [this.getRoleByName(r.data, 'default-roles-' + realm)];
      })
      .catch((e) => {
        throw new HttpException(`failed to get default role: ${e.response.data.error_description}`, e.response.status);
      });

    // Delete the default role mapping
    await axios
      .delete(this.httpHelper.realmAdminUrl(realm, `users/${userid}/role-mappings/realm`), {
        data: role,
        headers: this.httpHelper.authHeader(token),
      })
      .catch((e) => {
        throw new HttpException(`failed to delete default role: ${e.response.data.error_description}`, e.response.status);
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
        throw new HttpException(`failed to add assigned role: ${e.response.data.error_description}`, e.response.status);
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
        throw new HttpException(`failed to get realm roles: ${e.response.data.error_description}`, e.response.status);
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

  /**
   * Extract the realm from the token
   *
   * @param token authorization token
   * @returns name of the realm
   */
  public getTokenInfo(token: string): Record<string, any> {
    const decoded = this.decodeToken(token);

    return {
      realm: decoded['https://hasura.io/jwt/claims']['x-hasura-realm-id'],
      locale: decoded['locale'],
    };
  }

  //#endregion

  //#region Realm Management

  /**
   * Create a new realm
   *
   * @param realm_name name of the realm to create
   * @param token authorization token
   */
  public async createRealm(realm_name: string, token: string): Promise<void> {
    DataTypeValidator.IsNotBlank(realm_name, 'name must be specified').IsNotBlank(token, 'token must be specified');

    const realm = getRealmDefinition(realm_name);
    const url = `${this.httpHelper.baseServerUrl}/admin/realms`;

    // Create the new user
    await axios
      .post(url, realm, this.httpHelper.buildHeader(token))
      .then(() => {
        //console.log(r.status);
      })
      .catch((e) => {
        throw new HttpException(`failed to create realm: ${e.response.data.error_description}`, e.response.status);
      });
  }

  /**
   * Delete a realm
   * @param realm_name name of the realm to delete
   */
  public async deleteRealm(realm_name: string): Promise<void> {
    DataTypeValidator.IsNotBlank(realm_name, 'name must be specified');

    const admin_token = await GetAdminAuthToken();
    const url = this.httpHelper.realmAdminUrl(realm_name);

    await axios.delete(url, this.httpHelper.buildHeader(admin_token)).catch((e) => {
      throw new HttpException(`failed to delete realm: ${e.response.data.error_description}`, e.response.status);
    });
  }

  //#endregion
}
