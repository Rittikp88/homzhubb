import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { User } from '@homzhub/common/src/domain/models/User';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ISupportPayload, IMarketTrendParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { SocialAuthProviders } from '@homzhub/common/src/constants/SocialAuthProviders';

const ENDPOINTS = {
  getCountryCodes: 'countries/',
  getCurrencyCodes: 'currency-codes/',
  carpetAreaUnits: 'carpet-area-units/',
  maintenanceUnits: 'list-of-values/maintenance-units/',
  onBoarding: 'onboardings/',
  supportCategories: 'list-of-values/client-support-categories/',
  supportContact: 'client-support/contacts/',
  clientSupport: 'client-support/',
  getMarketTrends: 'market-trends/',
  updateMarketTrends: (id: number): string => `market-trends/${id}/`,
};

class CommonRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getCountryCodes = async (): Promise<Country[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCountryCodes);
    return ObjectMapper.deserializeArray(Country, response);
  };

  public getCurrencyCodes = async (): Promise<Currency[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCurrencyCodes);
    return ObjectMapper.deserializeArray(Currency, response);
  };

  public getCarpetAreaUnits = async (): Promise<CarpetArea[]> => {
    const response = await this.apiClient.get(ENDPOINTS.carpetAreaUnits);
    return ObjectMapper.deserializeArray(CarpetArea, response);
  };

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding);
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getSocialMedia = (): SocialAuthProvider[] => {
    return ObjectMapper.deserializeArray(SocialAuthProvider, SocialAuthProviders);
  };

  public getMaintenanceUnits = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.maintenanceUnits);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getSupportCategories = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.supportCategories);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getSupportContacts = async (): Promise<User> => {
    const response = await this.apiClient.get(ENDPOINTS.supportContact);
    return ObjectMapper.deserialize(User, response);
  };

  public postClientSupport = async (payload: ISupportPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.clientSupport, payload);
  };

  public getMarketTrends = async (params: IMarketTrendParams): Promise<MarketTrends> => {
    const response = await this.apiClient.get(ENDPOINTS.getMarketTrends, params);
    return ObjectMapper.deserialize(MarketTrends, response);
  };

  public updateMarketTrends = async (id: number): Promise<void> => {
    await this.apiClient.patch(ENDPOINTS.updateMarketTrends(id));
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
