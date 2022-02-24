import axios from 'axios';
import { KeycloakConnectConfig, TokenValidation } from 'nest-keycloak-connect';

export const AdminCredentials = {
  user: process.env.ADMIN_API_USER,
  password: process.env.ADMIN_API_PASSWORD,
};

export async function GetAdminAuthToken(): Promise<string> {
  const url = `${process.env.KEYCLOAK_ENDPOINT}/realms/master/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append('username', AdminCredentials.user);
  params.append('password', AdminCredentials.password);
  params.append('client_id', 'admin-cli');
  params.append('grant_type', 'password');

  const r = await axios.post(url, params).then((r) => r.data);
  if (!r['access_token']) throw 'Admin access is not available';

  return r.access_token;
}

// Cache for multitenant realm public keys
const realm_public_keys: Record<string, any> = {};

export function CacheRealmKeys(): void {
  GetAdminAuthToken().then(async (token) => {
    const headers = { maxContentLength: 100000000, maxBodyLength: 1000000000, headers: { Authorization: `Bearer ${token}` } };
    const realms_url = `${process.env.KEYCLOAK_ENDPOINT}/admin/realms`;

    //console.log('Get realms: ' + realms_url);

    await axios.get(realms_url, headers).then(async (r) => {
      const promises = r.data.map(async (realm_details: Record<string, any>) => {
        const realm = realm_details['realm'];

        await axios.get(`${process.env.KEYCLOAK_ENDPOINT}/realms/${realm}`, headers).then((r) => {
          const key = r.data['public_key'];
          realm_public_keys[realm] = key;
          console.log(realm);
        });
      });

      await Promise.all(promises);
      console.log(JSON.stringify(realm_public_keys));
    });
  });
}

const keycloak_config: KeycloakConnectConfig = {
  authServerUrl: process.env.KEYCLOAK_ENDPOINT,
  clientId: process.env.KEYCLOAK_APICLIENT,
  secret: 'failed_to_resolve_realm',
  bearerOnly: true,
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
      //console.log(JSON.stringify(realm_public_keys));

      console.log('***************************************************');
      console.log(`Resolve Realm: '${realm}'  Key: ${key}`);

      return key;
    },
  },
};

export default keycloak_config;

void CacheRealmKeys();

/*
const keycloak_config: KeycloakConnectConfig = {
  authServerUrl: process.env.KEYCLOAK_ENDPOINT,
  realm: process.env.KEYCLOAK_REALM,
  realmPublicKey: process.env.KEYCLOAK_REALM_KEY,
  clientId: process.env.KEYCLOAK_APICLIENT,
  secret: process.env.KEYCLOAK_APICLIENT_SECRET,
  bearerOnly: true,
  tokenValidation: TokenValidation.ONLINE,
  useNestLogger: true,
};
*/
