import { KeycloakConnectConfig, TokenValidation } from 'nest-keycloak-connect';

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

export default keycloak_config;
