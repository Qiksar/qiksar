/**
 * User profile
 */
export default class User {
  /**
   * Unique ID from authentication service
   */
  auth_id = '';

  /**
   * Auth realm
   */
  realm = '';

  /**
   * Unique user name
   */
  username = '';

  /**
   * User's first name
   */
  firstname = '';

  /**
   * User's last name
   */
  lastname = '';

  /**
   * Email address
   */
  email = '';

  /**
   * Indicates if the user has verified their email address
   */
  emailVerified = false;

  /**
   * List of roles assigned to the user
   */
  roles: string[] = [];

  /**
   * Timestamp of last login
   */
  lastLogin = '';

  /**
   * Locale or user specific terminology
   */
  locale = process.env.DEFAULT_LOCALE ?? 'en-AU';
}
