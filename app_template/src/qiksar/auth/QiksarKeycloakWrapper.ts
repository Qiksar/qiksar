/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router as vueRouter } from 'vue-router';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

import QiksarAuthWrapper from './QiksarAuthWrapper';
import useUserStore from './userStore';
import User from './user';
import Translator from '../Translator/Translator';
import TokenStore from '../Translator/TokenStore';
import { GqlRecord } from '../qikflow/base/GqlTypes';

/**
 * Keycloak implementation of authentication and authorisation
 */
export default class QiksarKeycloakWrapper implements QiksarAuthWrapper {
  //#region Properties

  // actual instance of keycloak
  private keycloak: Keycloak.KeycloakInstance;

  // The realm detected at login
  private realm = 'none specified';

  // Check for token refresh every 30 seconds
  private kc_token_check_seconds = 30 * 1000;

  // When token is checked, it must be valid for at least this amount of time, else it will be refreshed
  private kc_min_validity_seconds = 60;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tokenRefresh: any = null;

  // Global store used to manage state of the user profile
  private userStore: any;

  // User profile
  private user: User = new User();

  //#endregion

  constructor() {
    if (!process.env.PUBLIC_AUTH_ENDPOINT)
      throw 'PUBLIC_AUTH_ENDPOINT is not defined';

    const [, , subdomain] = window.location.hostname.split('.').reverse();

    if (!subdomain || subdomain.length == 0) this.realm = 'app';
    else this.realm = subdomain;

    //console.log('Realm: >' + this.realm + '<');

    // Configuration details for REALM and CLIENT
    const kc_config: Keycloak.KeycloakConfig = {
      url: process.env.PUBLIC_AUTH_ENDPOINT,
      realm: this.realm,
      clientId: 'app-client',
    };

    // Create a keycloak instance
    this.keycloak = Keycloak(kc_config);

    if (!this.keycloak)
      throw 'Qiksar Initialisation Error: Keycloak did not initialise';
  }

  //#region getters
  /**
   * The authenticated user's profile
   */
  get User(): User {
    return this.user;
  }

  /**
   * Indicates the user's authentication state
   */
  IsAuthenticated(): boolean {
    return this.keycloak.authenticated || false ? true : false;
  }

  /**
   * he authorisation token provided by the service after login
   */
  GetAuthToken(): string {
    //console.log(keycloak.token);
    return (this.keycloak.token as string) ?? 'unauthenticated';
  }

  /**
   * Indicates if the user has a specified role
   *
   * @param role Indicates
   */
  HasRealmRole(roleName: string | undefined): boolean {
    const hasRole: boolean = this.keycloak.hasRealmRole(roleName ?? '');

    //console.log('HasRealmRole: ' + (roleName ?? 'none') + ' = ' + hasRole.toString());

    return hasRole;
  }

  // Get the full host URL and append the destination path in order to form a redirect URI
  private getRedirectTarget(path: string): string {
    let basePath: string = window.location.toString();
    let index: number = basePath.indexOf('//') + 2;

    while (index < basePath.length && basePath[index] != '/') index++;

    basePath = basePath.substr(0, index + 1) + path;

    return basePath;
  }

  // Get Keycloak user profile
  private async GetUserProfile(): Promise<User> {
    if (!this.IsAuthenticated()) {
      return {} as User;
    }

    let kc_profile: KeycloakProfile = {};

    await this.keycloak
      .loadUserProfile()
      .then((p: KeycloakProfile) => {
        kc_profile = p;
      })
      .catch((e) => {
        throw (
          'GetUserProfile - Error: Failed to load user profile ' +
          JSON.stringify(e)
        );
      });

    const metadata = (kc_profile as GqlRecord).userProfileMetadata as GqlRecord;
    const attributes = metadata.attributes as GqlRecord;

    const user_profile: User = {
      auth_id: (kc_profile.id as string) ?? '',
      realm: this.realm,
      username: (kc_profile.username as string) ?? '',
      email: kc_profile.email ?? '',
      emailVerified: kc_profile.emailVerified ?? false,
      firstname: (kc_profile.firstName as string) ?? '',
      lastname: (kc_profile.lastName as string) ?? '',
      roles: this.GetUserRoles(),
      mobile: (attributes['mobile_phone'] as string) ?? '',
      locale: (attributes['locale'] as string) ?? process.env.DEFAULT_LOCALE,
    };

    //console.log('PROFILE **************************');
    //console.log(JSON.stringify(user_profile));
    //console.log('**************************');

    await this.ImportLocale(user_profile.locale);

    return user_profile;
  }

  /**
   * Get the list of roles assigned to the user
   */
  GetUserRoles(): string[] {
    return (this.keycloak.realmAccess?.roles as string[]) ?? [];
  }

  //#endregion

  //#region Auth Lifecycle

  /**
   * Initialise the authorisation service, but does not trigger the aiuth flow
   * @param userStore Store which containers the user profile
   */
  async Init(router: vueRouter): Promise<void> {
    this.userStore = useUserStore();

    // Initialisation options
    const kc_init_options: Keycloak.KeycloakInitOptions = {
      // onLoad: 'login-required',
      checkLoginIframe: false,
    };

    await this.keycloak.init(kc_init_options).then(async (auth_result) => {
      await this.AuthComplete(auth_result);
      this.SetupRouterGuards(router);
    });
  }

  /**
   * Trigger the authentication flow
   *
   * @param route The route to go to after auth completes
   */
  Login(path: string): void {
    const redirectUri = this.getRedirectTarget(path);
    const options: Keycloak.KeycloakLoginOptions = { redirectUri };

    void this.keycloak.login(options).then(async () => {
      await this.AuthComplete(true);
    });
  }

  /**
   * Log out and clear the authorisation token
   */
  Logout() {
    this.userStore.$reset();
    void this.keycloak.logout();
  }

  // Triggered when authentication is completed
  private async AuthComplete(auth: boolean): Promise<void> {
    if (auth) {
      const profile = await this.GetUserProfile();
      this.userStore.setUser(profile);
      this.userStore.setLoggedIn(this.IsAuthenticated());

      if (this.tokenRefresh) clearTimeout(this.tokenRefresh);

      this.tokenRefresh = setInterval(
        () => {
          if (this.keycloak) {
            this.keycloak
              .updateToken(this.kc_min_validity_seconds)
              .catch((e) => {
                console.error('Token refresh failed');
                console.error('Exception: ' + JSON.stringify(e));
              });
          }
        },

        this.kc_token_check_seconds
      );
    }
  }

  //#endregion

  //#region Router

  /**
   * Set up guards on secured routes
   *
   * @param router
   */
  SetupRouterGuards(router: vueRouter): void {
    router.beforeEach((to, from, next) => {
      const required_role: string = <string>to.meta.role ?? 'unauthorized';
      const allow_anonymous: boolean = <boolean>to.meta.anonymous ?? false;

      if (allow_anonymous) {
        // Page doesn't require auth
        next();
      } else if (!this.IsAuthenticated()) {
        // User must be logged in
        this.Login(to.path);
      } else if (this.HasRealmRole(required_role)) {
        // User must have at least the default role
        next();
      } else {
        next({ path: '/unauthorized' });
      }
    });
  }

  //#endregion

  //#region User Profile

  // Import the locale according to the setting on the user profile
  private async ImportLocale(locale_setting: string) {
    // Import the locale for the user
    await import('src/domain/i18n/' + locale_setting).then((module) => {
      //console.log('Translator - Loaded : ' + JSON.stringify(module.default));
      //console.log('CURRENT USER AUTHID: ' + user_profile.auth_id );
      //console.log('CURRENT USER LOCALE: ' + user_profile.locale);

      Translator.InitInstance(this.user, module.default, new TokenStore());
    });
  }

  //#endregion
}
