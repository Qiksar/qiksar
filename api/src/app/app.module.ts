import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import AuthConfig from '../config/AuthConfig';
import TenantModule from '../tenant/tenant.module';
import AuthModule from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TenantModule, KeycloakConnectModule.register(AuthConfig)],
  controllers: [],
  providers: [
    // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    /*
    console.log(`authServerUrl: ${process.env.KEYCLOAK_ENDPOINT}`);
    console.log(`realm: ${process.env.KEYCLOAK_REALM}`);
    console.log(`realmPublicKey: ${process.env.KEYCLOAK_REALM_KEY}`);
    console.log(`clientId: ${process.env.KEYCLOAK_APICLIENT}`);
    console.log(`secret: ${process.env.KEYCLOAK_APICLIENT_SECRET}`);
*/
  }
}
