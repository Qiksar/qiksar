import { boot } from 'quasar/wrappers';
import QiksarTranslator from 'src/qiksar/i18n/QiksarTranslator'

const translator = new QiksarTranslator();

// This call permists us to call t('some text', true/false)
// This makes it possible to call t() whilst processing rows of data where some columns are translated and others are not
export function t(txt: string, translate = true): string {
  return translator.translate(txt, translate);
}
//----------------------------------------------------------------------------------------------------------------
//
// BOOT - Internationalisation
//
// Initialise the localisation module with the default locale.
//

// TODO this import needs to be dynamic
export default boot(() => {
  const locale = process.env.DEFAULT_LOCALE ?? 'en-AU';
  translator.Init(locale);
});
