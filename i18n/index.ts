import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import es from './es.json';
import pt from './pt.json';

const RESOURCES = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('user-language');

  if (!savedLanguage) {
    const deviceLanguage = Localization.getLocales()[0].languageCode;
    savedLanguage = deviceLanguage;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4', // <--- ALTERADO AQUI DE 'v3' PARA 'v4'
    resources: RESOURCES,
    lng: savedLanguage || 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;