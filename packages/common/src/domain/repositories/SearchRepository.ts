import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFilterDetails } from '@homzhub/common/src/domain/models/Search';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

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

  public getProperties = async (requestBody: any): Promise<AssetSearch> => {
    const response = await this.apiClient.get(ENDPOINTS.getProperties(), requestBody);
    return ObjectMapper.deserialize(AssetSearch, response);
  };
}

const searchRepository = new SearchRepository();
export { searchRepository as SearchRepository };
