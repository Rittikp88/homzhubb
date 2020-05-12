import { Services, InitOptions, LanguageDetectorAsyncModule } from 'i18next';
import { supportedLanguages } from '@homzhub/common/src/services/Localization/constants';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect(callback: (lng: string) => void): void {
    callback(supportedLanguages.English);
  },
  init: (services: Services, detectorOptions: object, i18nextOptions: InitOptions): void => {},
  cacheUserLanguage: (lng: string): void => {},
};

export default languageDetector;
