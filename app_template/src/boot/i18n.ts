import { boot } from 'quasar/wrappers';
import QiksarTranslator from 'src/qiksar/i18n/QiksarTranslator'
import enAU from 'src/i18n/en-AU';

const translator = new QiksarTranslator();

// This call permists us to call t('some text', true/false)
// This makes it possible to call t() whilst processing rows of data where some columns are translated and others are not
export function t(txt: string, translate = true): string {
  return translator.translate(txt, translate);
}

export default boot(() => {
  
  const config = {
    'en-AU': enAU
  };

  translator.Init(config);
});
