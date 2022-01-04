/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createI18n } from 'vue-i18n';

const logWarnings = (process.env.I18N_WARNINGS ?? 'false') === 'true';

export default class QiksarTranslator {

  static DefaultLocale = 'en-AU';

  i18n:any;

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
  
  Init(messages:Record<string, unknown>):void {
 
   this.SetLocale(QiksarTranslator.DefaultLocale, messages);
  }
  
// This call permists us to call t('some text, true/false)
// It is now possible to call t() with rows of data and have columns optionally translated
// That way we can translate enums and similar data columns on tables
 public translate(txt: string, translate = true): string {
  const trn:string = translate ? this.i18n.global.t(txt, { defaultValue: txt }) : txt;
  //console.log(trn);

  return trn;
  }

}