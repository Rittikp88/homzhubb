import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ICountryCode, ICarpetAreaUnit } from '@homzhub/common/src/domain/models/CountryCode';

const ENDPOINTS = {
  getCountryCodes: (): string => 'countries',
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

  public getCarpetAreaUnits = async (): Promise<ICarpetAreaUnit[]> => {
    return await this.apiClient.get(ENDPOINTS.carpetAreaUnits());
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
