import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { AssetAdvertisement } from '@homzhub/common/src/domain/models/AssetAdvertisement';

const ENDPOINTS = {
  getMarketTrends: (): string => 'market-trends/',
  getAssetMetrics: (): string => 'dashboard/management-tab/',
  getAdvertisements: (): string => 'advertisements/',
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
  getAssetNotifications: (): string => 'asset-notifications/',
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

  public getAdvertisements = async (): Promise<AssetAdvertisement> => {
    const response = await this.apiClient.get(ENDPOINTS.getAdvertisements());
    return ObjectMapper.deserialize(AssetAdvertisement, response);
  };

  // TODO: Return type to be added once the api is ready
  public getAssetNotifications = async (): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.getAssetNotifications());
  };
}

const dashboardRepository = new DashboardRepository();
export { dashboardRepository as DashboardRepository };
