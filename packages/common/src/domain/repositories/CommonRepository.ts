import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ICountryCode, ICarpetAreaUnit } from '@homzhub/common/src/domain/models/CountryCode';
import { ICurrency } from '@homzhub/common/src/domain/models/Currency';

const ENDPOINTS = {
  getCountryCodes: (): string => 'countries',
  getCurrencyCodes: (): string => 'currency-codes/',
  carpetAreaUnits: (): string => 'carpet-area-units/',
};

class CommonRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getCountryCodes = async (): Promise<ICountryCode[]> => {
    return await this.apiClient.get(ENDPOINTS.getCountryCodes());
  };

  public getCurrencyCodes = async (): Promise<ICurrency[]> => {
    return this.apiClient.get(ENDPOINTS.getCurrencyCodes());
  };

  public getCarpetAreaUnits = async (): Promise<ICarpetAreaUnit[]> => {
    return await this.apiClient.get(ENDPOINTS.carpetAreaUnits());
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
