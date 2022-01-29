import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import configuration from './ApiConfig';
import { TenantModule } from './tenant.module';

@Module({
  imports: [
    TenantModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_ENDPOINT,
      realm: process.env.KEYCLOAK_REALM,
      realmPublicKey: process.env.KEYCLOAK_REALM_KEY,
      clientId: process.env.KEYCLOAK_CLIENT,
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
      bearerOnly: true,
    }),
  ],
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
export class AppModule {}
