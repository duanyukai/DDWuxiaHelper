import i18next from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// todo 暂时不启用语言
import zh_cn from './zh-cn.json';
import ko_kr from './ko-kr.json';

i18next
  // .use(LanguageDetector)
  .init({
    fallbackLng: 'zh',
    debug: true,
    resources: {
      en: {
        translation: {
          age: { label: 'Age', },
          home: { label: 'Home', },
          name: { label: 'Name111', },
        },
      },
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