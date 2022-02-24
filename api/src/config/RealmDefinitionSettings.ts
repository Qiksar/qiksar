export interface RealmDefinitionSettings {
  KEYCLOAK_REALM_UUID: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_REALM_NAME: string;
  KEYCLOAK_CLIENT: string;
  KEYCLOAK_ENDPOINT: string;
  APP_URL: string;
  SMTP_PASSWORD: string;
  SMTP_EMAIL_ADDRESS: string;
  SMTP_SENDER_NAME: string;
}

export default function getRealmDefinitionSettings(): RealmDefinitionSettings {
  return {
    KEYCLOAK_REALM_UUID: process.env.KEYCLOAK_REALM_UUID,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_REALM_NAME: process.env.KEYCLOAK_REALM_NAME,
    KEYCLOAK_CLIENT: process.env.KEYCLOAK_CLIENT,
    KEYCLOAK_ENDPOINT: process.env.KEYCLOAK_ENDPOINT,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_EMAIL_ADDRESS: process.env.SMTP_EMAIL_ADDRESS,
    SMTP_SENDER_NAME: process.env.SMTP_SENDER_NAME,
    APP_URL: process.env.APP_URL,
  };
}
