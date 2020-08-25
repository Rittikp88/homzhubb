import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';

const ENDPOINTS = {
  getAssetMetrics: (): string => 'portfolio/management-tab/',
  getAssetFilter: (): string => 'portfolio/asset-filters/',
};

class PortfolioRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetMetrics = async (): Promise<AssetMetrics> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetMetrics());
    return ObjectMapper.deserialize(AssetMetrics, response);
  };

  public getAssetFilters = async (): Promise<AssetFilter[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetFilter());
    return ObjectMapper.deserializeArray(AssetFilter, response);
  };
}

const portfolioRepository = new PortfolioRepository();
export { portfolioRepository as PortfolioRepository };
