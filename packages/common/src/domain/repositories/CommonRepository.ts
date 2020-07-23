import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ICarpetAreaUnit, CountryCode } from '@homzhub/common/src/domain/models/CountryCode';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Onboarding } from '@homzhub/common/src/domain/models/Onboarding';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

const ENDPOINTS = {
  getCountryCodes: (): string => 'countries/',
  getCurrencyCodes: (): string => 'currency-codes/',
  carpetAreaUnits: (): string => 'carpet-area-units/',
  onboarding: (): string => 'onboardings/',
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

  public getCarpetAreaUnits = async (): Promise<ICarpetAreaUnit[]> => {
    return await this.apiClient.get(ENDPOINTS.carpetAreaUnits());
  };

  public getOnboarding = async (): Promise<Onboarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onboarding());
    return ObjectMapper.deserializeArray(Onboarding, response);
  };

  public getSocialMedia = async (): Promise<SocialMediaProvider[]> => {
    const response = await this.apiClient.get(ENDPOINTS.socialMedia());
    return ObjectMapper.deserializeArray(SocialMediaProvider, response);
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
