import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh_cn from './zh-cn.json';
import ko_kr from './ko-kr.json';

i18next
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    lng: 'zh',
    debug: true,
    resources: {
      'zh': zh_cn,
      'kr': ko_kr
    },
    interpolation: {
      escapeValue: false,
    },

    // react i18next special options (optional)
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  });

export default i18next;
