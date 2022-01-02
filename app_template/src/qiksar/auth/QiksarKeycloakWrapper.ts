/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import Keycloak, { KeycloakProfile } from 'keycloak-js';
import QiksarAuthWrapper from './QiksarAuthWrapper';
import { userStore } from 'src/boot/pinia';
import User from 'src/domain/qikflow/store/types/user';

export class QiksarKeycloakWrapper implements QiksarAuthWrapper {

    // actual instance of keycloak
    private keycloak:Keycloak.KeycloakInstance;
  
    // The realm detected at login
    private realm = 'none specified';
    
    // Check for token refresh every 30 seconds
    private kc_token_check_seconds = (30*1000);
  
    // When token is checked, it must be valid for at least this amount of time, else it will be refreshed
    private kc_min_validity_seconds = 60;
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private tokenRefresh: any = null;
  
  
    constructor () {
        
      if (!process.env.KEYCLOAK_AUTH_ENDPOINT) 
        throw 'KEYCLOAK_AUTH_ENDPOINT is not defined';
  
      const [ , , subdomain] = window.location.hostname.split('.').reverse();
      
      if(!subdomain || subdomain.length == 0)
        this.realm='app';
      else
        this.realm=subdomain;
      
      console.log('Realm: >' + this.realm + '<');
  
      // Configuration details for REALM and CLIENT
      const kc_config: Keycloak.KeycloakConfig = {
        url: process.env.KEYCLOAK_AUTH_ENDPOINT,
        realm: this.realm,
        clientId: 'app-client'
      }
  
      // Create a keycloak instance
       this.keycloak = Keycloak(kc_config);
  
       if(!this.keycloak)
        throw 'Qiksar Initialisation Error: Keycloak did not initialise';
    }
    
    // Get the full host URL and append the destination path in order to form a redirect URI
    private getRedirectTarget(path:string):string {
      let basePath:string = window.location.toString();
      let index:number = basePath.indexOf('//') + 2;
    
      while (index < basePath.length && basePath[index] != '/')
        index ++;
  
      basePath = basePath.substr(0, index + 1) + path;
    
      return basePath;
    }
  
    // Get Keycloak user profile
    async GetUserProfile():Promise<KeycloakProfile> {
      let profile: KeycloakProfile = {};
  
      if (this.IsAuthenticated()) {
        await this
        .keycloak
        .loadUserProfile()
        .then((p: KeycloakProfile) => {
            profile = p;
          })
        .catch((e) => {
            console.error('!!!! Failed to load user profile');
            console.error(JSON.stringify(e));
          });
      }
  
      return profile;
    }
  
    GetUserRoles():string[] {
      return this.keycloak.realmAccess?.roles ?? []
    }
  
    // Triggered when authentication is completed
    async AuthComplete(auth: boolean):Promise<void> { 
    
      // If authentication was required then capture the token
    const profile = await this.GetUserProfile();
    
    const userDetails: User = {
      realm: this.realm,
      username: profile.username ?? '',
      email: profile.email ?? '',
      firstname: profile.firstName ?? '',
      lastname: profile.lastName ?? '',
      roles: [],
      lastLogin: ''
    };
  
    if (profile)
      userDetails.roles = this.GetUserRoles();
  
    userStore.setUser(userDetails);
    userStore.setLoggedIn(this.IsAuthenticated());
  
    if (auth) {
      if(this.tokenRefresh)
        clearTimeout(this.tokenRefresh);
  
      this.tokenRefresh = setInterval(
        () => {
          if(this.keycloak) {
              this
              .keycloak
              .updateToken(this.kc_min_validity_seconds)
              .catch(e => {
                console.error('Token refresh failed');
                console.error('Exception: ' + JSON.stringify(e));
              });
            }
          },
  
        this.kc_token_check_seconds);
      }
    }
  
    // Check if user is authenticated
    IsAuthenticated():boolean {
      return (this.keycloak.authenticated || false) ? true : false;
    }
    
    // Get authorisation token from keycloak
    GetAuthToken():string {
      //console.log(keycloak.token);
      return this.keycloak.token ?? 'unauthenticated';
    }
  
    // Test if the  user has a specified role
    HasRealmRole(roleName:string | undefined): boolean {
      const hasRole = this.keycloak.hasRealmRole(roleName ?? '');
      console.log('HasRealmRole: ' + (roleName ?? 'none') + ' = ' + hasRole.toString());
    
      return hasRole;
    }
    
    // The login flow is executed
    Login(path: string): void {
      const redirectUri= this.getRedirectTarget(path);
      const options: Keycloak.KeycloakLoginOptions = { redirectUri }
    
      void this
        .keycloak
        .login(options)
        .then(async () => { await this.AuthComplete(true) });
    }
  
    // The current user will be logged out
    Logout() {
      userStore.$reset();
      void this.keycloak.logout();
    }
  
    async Init():Promise<void> {
      
      // Initialisation options
      const kc_init_options: Keycloak.KeycloakInitOptions = {
        // onLoad: 'login-required',
        checkLoginIframe: false 
      }
  
      await this
            .keycloak
            .init(kc_init_options)
            .then(async (auth_result) => { await this.AuthComplete(auth_result); }) 
    }
  }