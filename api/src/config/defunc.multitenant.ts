/** EXPERIMENTAL CODE
 * The idea was to allow the API to have access to multiple segrated tenants. 
 * The thought now is that even the API itself would be hosted in a different tenancy, so it is not necessary 
 * for it to dynamically resolve realms and their public keys
 * 
 * This code is simply retained for knowledge purposes
 // Cache for multitenant realm public keys
const realm_public_keys: Record<string, any> = {};

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
