import Config from 'react-native-config';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

// For WEB
const {
  REACT_APP_API_BASE_URL = '',
  REACT_APP_PLACES_API_BASE_URL = '',
  REACT_APP_OTP_LENGTH = 6,
  REACT_APP_PLACES_API_KEY = '',
  REACT_APP_STORAGE_SECRET = '',
  REACT_APP_RAZOR_API_KEY = '',
  REACT_APP_YOUTUBE_API_KEY = '',
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
} = Config;

class ConfigHelper {
  private readonly baseUrl: string;
  private readonly placesBaseUrl: string;
  private readonly otpLength: number;
  private readonly placesApiKey: string;
  private readonly storageKey: string;
  private readonly razorPayApiKey: string;
  private readonly youtubeApiKey: string;

  constructor() {
    this.baseUrl = REACT_APP_API_BASE_URL;
    this.placesBaseUrl = REACT_APP_PLACES_API_BASE_URL;
    this.otpLength = Number(REACT_APP_OTP_LENGTH);
    this.placesApiKey = REACT_APP_PLACES_API_KEY;
    this.storageKey = REACT_APP_STORAGE_SECRET;
    this.razorPayApiKey = REACT_APP_RAZOR_API_KEY;
    this.youtubeApiKey = REACT_APP_YOUTUBE_API_KEY;

    if (PlatformUtils.isMobile()) {
      this.baseUrl = REACT_NATIVE_APP_API_BASE_URL;
      this.placesBaseUrl = REACT_NATIVE_APP_PLACES_API_BASE_URL;
      this.otpLength = Number(REACT_NATIVE_APP_OTP_LENGTH);
      this.placesApiKey = REACT_NATIVE_APP_PLACES_API_KEY;
      this.storageKey = REACT_NATIVE_APP_STORAGE_SECRET;
      this.razorPayApiKey = REACT_NATIVE_APP_RAZOR_API_KEY;
      this.youtubeApiKey = REACT_NATIVE_APP_YOUTUBE_API_KEY;
    }
  }

  public getBaseUrl = (): string => this.baseUrl;

  public getPlacesBaseUrl = (): string => this.placesBaseUrl;

  public getOtpLength = (): number => this.otpLength;

  public getPlacesApiKey = (): string => this.placesApiKey;

  public getStorageSecret = (): string => this.storageKey;

  public getRazorApiKey = (): string => this.razorPayApiKey;

  public getYoutubeApiKey = (): string => this.youtubeApiKey;
}

const configHelper = new ConfigHelper();
export { configHelper as ConfigHelper };
