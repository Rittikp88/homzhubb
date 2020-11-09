import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { TenantHistory } from '@homzhub/common/src/domain/models/Tenant';
import { DetailType, IPropertyDetailPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getAssetMetrics: (): string => 'portfolio/management-tab/',
  getAssetFilter: (): string => 'portfolio/asset-filters/',
  getTenancies: (): string => 'portfolio/tenancies/',
  getAssetDetails: (): string => 'portfolio/asset-details/',
  getTenantHistory: (id: number): string => `assets/${id}/lease-tenants/`,
  getPropertyDetailById: (id: number): string => `assets/${id}/details/`,
  getPropertyDetailByListing: (id: number, listingType: string, listingId: number): string =>
    `assets/${id}/${listingType}/${listingId}/`,
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

  public getTenantHistory = async (id: number): Promise<TenantHistory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getTenantHistory(id));
    return ObjectMapper.deserializeArray(TenantHistory, response);
  };

  public getPropertyDetail = async (payload: IPropertyDetailPayload): Promise<Asset> => {
    const { id, type, asset_id } = payload;
    const url =
      type === DetailType.ASSET
        ? ENDPOINTS.getPropertyDetailById(asset_id)
        : ENDPOINTS.getPropertyDetailByListing(asset_id, type, id);
    const response = await this.apiClient.get(url);
    return ObjectMapper.deserialize(Asset, response);
  };
}

const portfolioRepository = new PortfolioRepository();
export { portfolioRepository as PortfolioRepository };
