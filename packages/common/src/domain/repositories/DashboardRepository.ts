import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { AssetAdvertisement } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

const ENDPOINTS = {
  getMarketTrends: (): string => 'market-trends/',
  getAssetMetrics: (): string => 'dashboard/management-tab/',
  getAdvertisements: (): string => 'advertisements/',
  getGeneralLedgers: (): string => 'general-ledgers/overall-performances/',
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

  public getGeneralLedgers = async (requestPayload: {
    transaction_date__lte: string;
    transaction_date__gte: string;
    transaction_date_group_by: string;
  }): Promise<GeneralLedgers[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getGeneralLedgers(), requestPayload);
    return ObjectMapper.deserializeArray(GeneralLedgers, response);
  };
}

const dashboardRepository = new DashboardRepository();
export { dashboardRepository as DashboardRepository };
