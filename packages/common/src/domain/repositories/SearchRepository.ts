import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IFilterDetails } from '@homzhub/common/src/domain/models/Search';

const ENDPOINTS = {
  getFilterData: (): string => 'asset-filters/',
  getProperties: (): string => 'asset-search/',
};

class SearchRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  // TODO: (Shikha) Type to be added
  public getFilterDetails = async (requestBody: any): Promise<IFilterDetails> => {
    return await this.apiClient.get(ENDPOINTS.getFilterData(), requestBody);
  };

  // TODO: (Rishabh) Type to be added
  public getProperties = async (requestBody: any): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.getProperties(), requestBody);
  };
}

const searchRepository = new SearchRepository();
export { searchRepository as SearchRepository };
