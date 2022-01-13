/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createI18n } from 'vue-i18n';
import User from '../auth/user';

const logWarnings = (process.env.I18N_WARNINGS ?? 'false') === 'true';

// This call permists us to call t('some text', true/false)
// This makes it possible to call t() whilst processing rows of data where some columns are translated and others are not
export function t(txt: string, translate = true): string {
  return Translator.Instance.translate(txt, translate);
}

export default class Translator {

  private static instance:Translator;

  i18n:any;
  private user: User;

  public static InitInstance(user:User, messages: any): void {
    Translator.instance = new Translator(user, messages);
  }

  public static get Instance():Translator {
    return Translator.instance;
  }

  private constructor(user:User, messages:any) {
    this.user = user;
    this.SetLocale(this.user.locale, messages);
  }

// The locale can be changed at any time...
  public SetLocale(locale:string, messages:any):void {

  this.i18n = createI18n({
    legacy: false,
    silentTranslationWarn: !logWarnings,
    fallbackWarn: logWarnings,
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
    missingWarn: logWarnings,
    locale: locale,
    messages: messages,
    });
  
  }
  
  // This call permists us to call t('some text, true/false)
  // It is now possible to call t() with rows of data and have columns optionally translated
  // That way we can translate enums and similar data columns on tables
  public translate(txt: string, translate = true): string {
    
  const detokenised:string = this.user.TokenStore.Expand(txt);
  const trn:string = translate ? this.i18n.global.t(detokenised, { defaultValue: detokenised }) : detokenised;

  //console.log(trn);

  return trn;
  }

}