import { Injectable } from '@nestjs/common';

@Injectable()
export default class Validator {
  public static IsValidUsername(username: string, error: string) {
    if (!/^[0-9a-zA-Z_.-]+$/.test(username)) throw error;
    return this;
  }

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

  public static IsNotBlank(value: string, error: string) {
    if (!(value === null || value === void 0 ? void 0 : value.trim().length)) throw error;
    return this;
  }
}
