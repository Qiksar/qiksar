import axios from 'axios';
import { KeycloakConnectConfig, TokenValidation } from 'nest-keycloak-connect';

/**
 * Build the credentials used to acquire an admin token for the API
 */
export const AdminCredentials = {
  user: process.env.ADMIN_API_USER,
  password: process.env.ADMIN_API_PASSWORD,
};

export const DefaultAppClient = 'app-client';

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

// Cache for multitenant realm public keys
const realm_public_keys: Record<string, any> = {};

/**
 * The purpose of this function is to list all of the tenant realms
 * then acquire and cache the public key for each
 */
export function CacheRealmKeys(): void {
  GetAdminAuthToken().then(async (token) => {
    const headers = { maxContentLength: 100000000, maxBodyLength: 1000000000, headers: { Authorization: `Bearer ${token}` } };
    const realms_url = `${process.env.KEYCLOAK_ENDPOINT}/admin/realms`;
    //console.log('Token: ' + token);
    //console.log('Get realms: ' + realms_url);

    await axios
      .get(realms_url, headers)
      .then(async (r) => {
        //console.log('Get realms response');
        //console.log(r.data);

        for (const realm_details of r.data) {
          const realm_name = realm_details['realm'];

          if (realm_name != 'master') {
            //console.log('Fetch realm: ' + realm_name);
            await axios.get(`${process.env.KEYCLOAK_ENDPOINT}/realms/${realm_name}`, headers).then((realm_object) => {
              const key = realm_object.data['public_key'];
              realm_public_keys[realm_name] = key;
              //console.log(realm_name);
            });
          }
        }

        console.log('Realms and their public keys');
        console.log(JSON.stringify(realm_public_keys));
        console.log('');
      })
      .catch((e) => {
        console.log(e.response.status + ' ' + e.response.statusText);
      });
  });
}

/**
 * This is the configuration of Nest Keycloak Connect
const keycloak_config: KeycloakConnectConfig = {
  authServerUrl: process.env.KEYCLOAK_ENDPOINT,
  clientId: process.env.KEYCLOAK_APICLIENT,
  secret: 'fallback',
  // bearerOnly: true,
  tokenValidation: TokenValidation.ONLINE,
  useNestLogger: true,

  multiTenant: {
    realmResolver: (request) => {
      const host = request.get('host');
      const parts = host.split('.');
      return parts.length > 1 ? parts[0] : 'app';
    },
    realmSecretResolver: (realm) => {
      const key = realm_public_keys[realm];

      console.log('***************************************************');
      console.log(`Resolved Realm: '${realm}'  Key: ${key}`);

      return key;
    },
  },
};

// Trigger the realm/public key cache process
void CacheRealmKeys();

*/

// This is the legacy configuration where one realm was shared with all tenants

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
