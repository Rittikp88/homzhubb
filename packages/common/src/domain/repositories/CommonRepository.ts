import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { CountryCode } from '@homzhub/common/src/domain/models/CountryCode';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';

const ENDPOINTS = {
  getCountryCodes: (): string => 'countries/',
  getCurrencyCodes: (): string => 'currency-codes/',
  carpetAreaUnits: (): string => 'carpet-area-units/',
  onBoarding: (): string => 'onboardings/',
  socialMedia: (): string => 'social-providers/',
};

class CommonRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getCountryCodes = async (): Promise<CountryCode[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCountryCodes());
    return ObjectMapper.deserializeArray(CountryCode, response);
  };

  public getCurrencyCodes = async (): Promise<Currency[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCurrencyCodes());
    return ObjectMapper.deserializeArray(Currency, response);
  };

  public getCarpetAreaUnits = async (): Promise<CarpetArea[]> => {
    const response = await this.apiClient.get(ENDPOINTS.carpetAreaUnits());
    return ObjectMapper.deserializeArray(CarpetArea, response);
  };

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding());
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getSocialMedia = async (): Promise<SocialMediaProvider[]> => {
    const response = await this.apiClient.get(ENDPOINTS.socialMedia());
    return ObjectMapper.deserializeArray(SocialMediaProvider, response);
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
