/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router as vueRouter } from 'vue-router';
import User from './user';

/**
 * Authorisation interface
 */
export default interface QiksarAuthWrapper {
  /**
   * Initialise the authorisation service, but does not trigger the aiuth flow
   * @param userStore Store which containers the user profile
   */
  Init(router: vueRouter): Promise<void>;

  /**
   * he authorisation token provided by the service after login
   */
  GetAuthToken(): string;

  /**
   * Trigger the authentication flow
   *
   * @param route The route to go to after auth completes
   */
  Login(route: string): void;

  /**
   * Log out and clear the authorisation token
   */
  Logout(): void;

  /**
   * Indicates the user's authentication state
   */
  IsAuthenticated(): boolean;

  /**
   * Indicates if the user has a specified role
   *
   * @param role Required role
   */
  HasRole(role: string): boolean;

  /**
   * The active user profile
   */
  get User(): User;

  /**
   * Get the list of roles assigned to the user
   */
  GetUserRoles(): string[];

  /**
   * Set up guards on secured routes
   *
   * @param router
   */
  SetupRouterGuards(router: vueRouter): void;

  /**
   * The authenticated user's profile
   */
  User: User;
}
