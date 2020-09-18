import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { INotificationsPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { AssetAdvertisement } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { AssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';

const ENDPOINTS = {
  getMarketTrends: (): string => 'market-trends/',
  getAssetMetrics: (): string => 'dashboard/management-tab/',
  getAdvertisements: (): string => 'advertisements/',
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
  getAssetNotifications: (): string => 'notifications/',
  updateNotifications: (id: number): string => `notifications/${id}/`,
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

  public getAdvertisements = async (payload?: { category: string }): Promise<AssetAdvertisement> => {
    const response = await this.apiClient.get(ENDPOINTS.getAdvertisements(), payload || {});
    return ObjectMapper.deserialize(AssetAdvertisement, response);
  };

  public getAssetNotifications = async (requestPayload: INotificationsPayload): Promise<AssetNotifications> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetNotifications(), requestPayload);
    return ObjectMapper.deserialize(AssetNotifications, response);
  };

  public updateNotificationStatus = async (id: number): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.updateNotifications(id));
  };
}

const dashboardRepository = new DashboardRepository();
export { dashboardRepository as DashboardRepository };
