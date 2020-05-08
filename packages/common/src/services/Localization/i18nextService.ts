import i18next, { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import languageDetector from './languageDetector';
import { LocaleConstants, supportedLanguages } from './constants';

class I18nextService {
  private readonly _instance: i18n;

  constructor() {
    this._instance = i18next.createInstance();
  }

  public init = async (): Promise<void> => {
    this._instance.use(initReactI18next).use(languageDetector);
    await this._instance.init(
      {
        whitelist: LocaleConstants.whitelist,
        resources: LocaleConstants.resources,
        fallbackLng: LocaleConstants.fallback,
        ns: LocaleConstants.namespaces,
        defaultNS: LocaleConstants.defaultNamespace,
        interpolation: {
          escapeValue: false,
        },
      },
      this.initCallback
    );
  };

  get instance(): i18n {
    return this._instance;
  }

  public t = (key: string, options?: any): string => {
    if (!this._instance) {
      this.init().then();
    }
    return this._instance.t(key, options);
  };

  public isRTL = (): boolean => {
    return I18nManager.isRTL;
  };

  public select<T>(map: { [position in 'rtl' | 'ltr']: T }): T {
    const key = this.isRTL ? 'rtl' : 'ltr';
    return map[key];
  }

  public changeLanguage = async (lngCode: supportedLanguages): Promise<void> => {
    await this._instance.changeLanguage(lngCode);
  };

  private initCallback = (error: Error): void => {
    if (error) {
      console.log(error);
    } else {
      console.log('Loaded i18next');
    }
  };
}

const i18nService = new I18nextService();
export { i18nService as I18nService };
