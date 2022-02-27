export default class DataTypeValidator {
  /**
   * Assert that a value is a valid username
   * @param username username used by the auth system
   * @param error message to use when assertion fails
   * @returns throws an exception for invalid values, else returns the validator object for fluent method calls
   */
  public static IsValidUsername(username: string, error: string) {
    if (!/^[0-9a-zA-Z_.-]+$/.test(username)) throw error;
    return this;
  }

  /**
   * Assert that a value is a valid email address
   * @param email email address
   * @param error message to use when assertion fails
   * @returns throws an exception for invalid values, else returns the validator object for fluent method calls
   */
  public static IsValidEmail(email: string, error: string) {
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
    )
      throw error;
    return this;
  }

  /**
   * Assert that a value is not an empty string
   * @param email email address
   * @param error message to use when assertion fails
   * @returns throws an exception for invalid values, else returns the validator object for fluent method calls
   */
  public static IsNotBlank(value: string, error: string) {
    if (!(value === null || value === void 0 ? void 0 : value.trim().length)) throw error;
    return this;
  }
}
