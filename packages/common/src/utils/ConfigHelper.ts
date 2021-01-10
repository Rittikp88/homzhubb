import Config from 'react-native-config';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

export enum AppModes {
  DEBUG = 'DEBUG',
  RELEASE = 'RELEASE',
}

// For WEB
const {
  REACT_APP_API_BASE_URL = '',
  REACT_APP_PLACES_API_BASE_URL = '',
  REACT_APP_OTP_LENGTH = 6,
  REACT_APP_PLACES_API_KEY = '',
  REACT_APP_STORAGE_SECRET = '',
  REACT_APP_RAZOR_API_KEY = '',
  REACT_APP_YOUTUBE_API_KEY = '',
  REACT_APP_MODE = AppModes.DEBUG,
} = process.env;

// For MOBILE
const {
  REACT_NATIVE_APP_API_BASE_URL,
  REACT_NATIVE_APP_PLACES_API_BASE_URL,
  REACT_NATIVE_APP_PLACES_API_KEY,
  REACT_NATIVE_APP_RAZOR_API_KEY,
  REACT_NATIVE_APP_OTP_LENGTH,
  REACT_NATIVE_APP_STORAGE_SECRET,
  REACT_NATIVE_APP_YOUTUBE_API_KEY,
  REACT_NATIVE_APP_MODE = AppModes.DEBUG,
  REACT_NATIVE_APP_GOOGLE_WEB_CLIENT_ID,
  REACT_NATIVE_APP_GOOGLE_IOS_CLIENT_ID,
} = Config;

class ConfigHelper {
  private readonly baseUrl: string;
  private readonly placesBaseUrl: string;
  private readonly otpLength: number;
  private readonly placesApiKey: string;
  private readonly storageKey: string;
  private readonly razorPayApiKey: string;
  private readonly youtubeApiKey: string;
  private readonly appMode: AppModes;
  private readonly googleWebClientId: string | undefined;
  private readonly googleIosClientId: string | undefined;

  constructor() {
    this.baseUrl = REACT_APP_API_BASE_URL;
    this.placesBaseUrl = REACT_APP_PLACES_API_BASE_URL;
    this.otpLength = Number(REACT_APP_OTP_LENGTH);
    this.placesApiKey = REACT_APP_PLACES_API_KEY;
    this.storageKey = REACT_APP_STORAGE_SECRET;
    this.razorPayApiKey = REACT_APP_RAZOR_API_KEY;
    this.youtubeApiKey = REACT_APP_YOUTUBE_API_KEY;
    this.youtubeApiKey = REACT_NATIVE_APP_MODE;
    this.appMode = REACT_APP_MODE as AppModes;

    if (PlatformUtils.isMobile()) {
      this.baseUrl = REACT_NATIVE_APP_API_BASE_URL;
      this.placesBaseUrl = REACT_NATIVE_APP_PLACES_API_BASE_URL;
      this.otpLength = Number(REACT_NATIVE_APP_OTP_LENGTH);
      this.placesApiKey = REACT_NATIVE_APP_PLACES_API_KEY;
      this.storageKey = REACT_NATIVE_APP_STORAGE_SECRET;
      this.razorPayApiKey = REACT_NATIVE_APP_RAZOR_API_KEY;
      this.youtubeApiKey = REACT_NATIVE_APP_YOUTUBE_API_KEY;
      this.appMode = REACT_NATIVE_APP_MODE as AppModes;
      this.googleWebClientId = REACT_NATIVE_APP_GOOGLE_WEB_CLIENT_ID;
      this.googleIosClientId = REACT_NATIVE_APP_GOOGLE_IOS_CLIENT_ID;
    }
  }

  public getBaseUrl = (): string => this.baseUrl;

  public getPlacesBaseUrl = (): string => this.placesBaseUrl;

  public getOtpLength = (): number => this.otpLength;

  public getPlacesApiKey = (): string => this.placesApiKey;

  public getStorageSecret = (): string => this.storageKey;

  public getRazorApiKey = (): string => this.razorPayApiKey;

  public getYoutubeApiKey = (): string => this.youtubeApiKey;

  public getAppMode = (): AppModes => this.appMode;

  public getGoogleWebClientId = (): string => this.googleWebClientId || '';

  public getGoogleIosClientId = (): string => this.googleIosClientId || '';
}

const configHelper = new ConfigHelper();
export { configHelper as ConfigHelper };
