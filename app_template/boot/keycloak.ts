/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// This helped us understand how to provide claims to Hasura...
// https://github.com/janhapke/hasura-keycloak

import { boot } from 'quasar/wrappers';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { userStore } from './pinia';
import User from '../domain/qikflow/store/types/user';

// Get the full host URL and append the destination path in order to form a redirect URI
const getRedirectTarget = function(path:string):string {
  let basePath:string = window.location.toString();
  let index:number = basePath.indexOf('//') + 2;
  
  while (index < basePath.length && basePath[index] != '/')
    index ++;

  basePath = basePath.substr(0, index + 1) + path;
  
  return basePath;
}

// Check if user is authenticated
export const IsAuthenticated = function ():boolean {
  return (keycloak.authenticated || false) ? true : false;
}

// Check if user is authenticated
export const GetAuthToken = function ():string {
  //console.log(keycloak.token);
  return keycloak.token ?? 'unauthenticated';
}

// Configuration details for REALM and CLIENT
const kc_config: Keycloak.KeycloakConfig = {
  url: 'http://localhost:8080/auth',
  realm: 'app',
  clientId: 'app-client'
}

// Initialisation options
const kc_init_options: Keycloak.KeycloakInitOptions = {
  // onLoad: 'login-required',
  checkLoginIframe: false 
}

// Get Keycloak user profile
const GetUserProfile = async () => {
  let profile: KeycloakProfile = {};

  await keycloak.loadUserProfile()
    .then((p: KeycloakProfile) => {
      profile = p;
    }).catch((e) => {
      console.error('!!!! Failed to load user profile');
      console.error(JSON.stringify(e));
    });

    return profile;
}

// Keycloak instance
const keycloak:Keycloak.KeycloakInstance = Keycloak(kc_config);



// Check for token refresh 
const kc_token_check_seconds = (30*1000);

// When token is checked, it must be valid for at least this amount of time, else it will be refreshed
const kc_min_validity_seconds = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tokenRefresh: any;

// Tests if the current user has a secified role
export const HasRealmRole = function(roleName:string | undefined): boolean {
  return keycloak.hasRealmRole(roleName ?? '');
}

// Triggered when authentication is completed
const AuthComplete = async (auth: boolean) => { // If authentication was required then capture the token
  const profile = await GetUserProfile();
  
  const  userDetails: User = {
    username: profile.username ?? '',
    email: profile.email ?? '',
    firstname: profile.firstName ?? '',
    lastname: profile.lastName ?? '',
    roles: keycloak.realmAccess?.roles ?? [],
    lastLogin: ''
  };

  userStore.setUser(userDetails);
  userStore.setLoggedIn(IsAuthenticated());

  if (auth) {
    if(tokenRefresh)
      clearTimeout(tokenRefresh);

    tokenRefresh = setInterval(() => {

    keycloak.updateToken(kc_min_validity_seconds)
      .catch(e => {
        console.error('Token refresh failed');
        console.error('Exception: ' + JSON.stringify(e));
      });
    }, kc_token_check_seconds);}
  }

// The login flow is executed
export const Login = function (path: string): void {
  const redirectUri= getRedirectTarget(path);
  const options: Keycloak.KeycloakLoginOptions = { redirectUri }
  void keycloak.login( options).then(async () => { await AuthComplete(true) });
}

// The current user will be logged out
export const Logout = () => {
  userStore.$reset();
  void keycloak.logout();
}

// Trigger Keycloak initialisation
export default boot(async () => {
    await keycloak.init(kc_init_options).then(async (auth) => { await AuthComplete(auth); }) 
  }
);