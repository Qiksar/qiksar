import axios from 'axios';
import { KeycloakConnectConfig, TokenValidation } from 'nest-keycloak-connect';

/**
 * Build the credentials used to acquire an admin token for the API
 */
export const AdminCredentials = {
  user: process.env.ADMIN_API_USER,
  password: process.env.ADMIN_API_PASSWORD,
};

/**
 * The frontend and API each have their own Keycloak client, so we need to specify the client used by the app.
 * The client used by the API is specified in the Keycloak configuration
 */
export const DefaultAuthClient = 'app-client';

/**
 * Acquire an admin level access token which will enable the API to create realms
 *
 * @returns Admin access token
 */
export async function GetAdminAuthToken(): Promise<string> {
  const url = `${process.env.KEYCLOAK_ENDPOINT}/realms/master/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('username', AdminCredentials.user);
  params.append('password', AdminCredentials.password);
  params.append('client_id', 'admin-cli');
  params.append('grant_type', 'password');

  const r = await axios
    .post(url, params)
    .then((r) => r.data)
    .catch((e) => {
      throw 'Admin access is not available' + '\n' + e;
    });
  if (!r['access_token']) throw 'Admin access is not available';

  //console.log(r.access_token);

  return r.access_token;
}

/**
 * Keycloak connect configuration
 */
const KeycloakConfiguration: KeycloakConnectConfig = {
  authServerUrl: process.env.KEYCLOAK_ENDPOINT,
  realm: process.env.KEYCLOAK_REALM,
  realmPublicKey: process.env.KEYCLOAK_REALM_KEY,
  clientId: process.env.KEYCLOAK_APICLIENT,
  secret: process.env.KEYCLOAK_APICLIENT_SECRET,
  bearerOnly: true,
  tokenValidation: TokenValidation.ONLINE,
  useNestLogger: true,
};

export default KeycloakConfiguration;
