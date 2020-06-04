import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ICountryCode } from '@homzhub/common/src/domain/models/CountryCode';

const ENDPOINTS = {
  getCountryCodes: (): string => 'countries',
};

class CommonRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getCountryCodes = async (): Promise<ICountryCode[]> => {
    return await this.apiClient.get(ENDPOINTS.getCountryCodes());
  };
}

const commonRepository = new CommonRepository();
export { commonRepository as CommonRepository };
