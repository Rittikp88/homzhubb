import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

const ENDPOINTS = {
  getAssetMetrics: (): string => 'portfolio/management-tab/',
  getAssetFilter: (): string => 'portfolio/asset-filters/',
  getTenancies: (): string => 'portfolio/tenancies/',
  getAssetDetails: (): string => 'portfolio/asset-details/',
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

  public getUserTenancies = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getTenancies());
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getUserAssetDetails = async (status: string): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetDetails(), { status });
    return ObjectMapper.deserializeArray(Asset, response);
  };
}

const portfolioRepository = new PortfolioRepository();
export { portfolioRepository as PortfolioRepository };
