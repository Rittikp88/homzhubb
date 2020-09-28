import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetGroupAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { TenantPreference } from '@homzhub/common/src/domain/models/Tenant';
import { OrderSummary } from '@homzhub/common/src/domain/models/OrderSummary';
import { IOrderSummaryPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  amenities: (): string => 'asset-groups/amenities/',
  tenantPreferences: (): string => 'tenant-preferences/',
  orderSummary: (): string => 'users/order-summary/',
};

class RecordAssetRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAmenities = async (): Promise<AssetGroupAmenity[]> => {
    const response = await this.apiClient.get(ENDPOINTS.amenities());
    return ObjectMapper.deserializeArray(AssetGroupAmenity, response);
  };

  public getTenantPreferences = async (asset_id: number): Promise<TenantPreference[]> => {
    const response = await this.apiClient.get(ENDPOINTS.tenantPreferences(), { asset_id });
    return ObjectMapper.deserializeArray(TenantPreference, response);
  };

  public getOrderSummary = async (payload: IOrderSummaryPayload): Promise<OrderSummary> => {
    const response = await this.apiClient.post(ENDPOINTS.orderSummary(), payload);
    return ObjectMapper.deserialize(OrderSummary, response);
  };
}

const recordAssetRepository = new RecordAssetRepository();
export { recordAssetRepository as RecordAssetRepository };
