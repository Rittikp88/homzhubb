import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

const ENDPOINTS = {
  getMarketTrends: (): string => 'market-trends/',
  getAssetMetrics: (): string => 'dashboard/management-tab/',
};

class DashboardRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getMarketTrends = async (limit: number): Promise<MarketTrends> => {
    const response = await this.apiClient.get(ENDPOINTS.getMarketTrends(), { limit });
    return ObjectMapper.deserialize(MarketTrends, response);
  };

  public getAssetMetrics = async (): Promise<AssetMetrics> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetMetrics());
    return ObjectMapper.deserialize(AssetMetrics, response);
  };
}

const dashboardRepository = new DashboardRepository();
export { dashboardRepository as DashboardRepository };
