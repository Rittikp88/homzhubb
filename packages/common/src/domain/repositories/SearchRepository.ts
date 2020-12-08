import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

const ENDPOINTS = {
  getFilterData: (): string => 'asset-filters/',
  getPropertiesForLeaseListings: (): string => 'lease-listings/search/',
  getPropertiesForSaleListings: (): string => 'sale-listings/search/',
};

class SearchRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getFilterDetails = async (requestBody: IFilter): Promise<FilterDetail> => {
    const response = await this.apiClient.get(ENDPOINTS.getFilterData(), requestBody);
    return ObjectMapper.deserialize(FilterDetail, response);
  };

  public getPropertiesForLeaseListings = async (requestBody: any): Promise<AssetSearch> => {
    const response = await this.apiClient.get(ENDPOINTS.getPropertiesForLeaseListings(), requestBody);
    return ObjectMapper.deserialize(AssetSearch, response);
  };

  public getPropertiesForSaleListings = async (requestBody: any): Promise<AssetSearch> => {
    const response = await this.apiClient.get(ENDPOINTS.getPropertiesForSaleListings(), requestBody);
    return ObjectMapper.deserialize(AssetSearch, response);
  };
}

const searchRepository = new SearchRepository();
export { searchRepository as SearchRepository };
