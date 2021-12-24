import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from '../i18n';

const logWarnings = (process.env.I18N_WARNINGS ?? 'false') === 'true';

const i18n = createI18n({
  legacy: false,
  silentTranslationWarn: !logWarnings,
  fallbackWarn: logWarnings,
  missingWarn: logWarnings,
  locale: 'en-AU',
  messages,
});

// This call permists us to call t('some text, true/false)
// It is now possible to call t() with rows of data and have columns optionally translated
// That way we can translate enums and similar data columns on tables
export function t(txt: string, translate = true): string {
  const trn = translate ? i18n.global.t(txt, { defaultValue: txt }) : txt;
  //console.log(trn);

  return trn;
}

export default boot(() => {
  //
});
