import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { TenantPreference } from '@homzhub/common/src/domain/models/Tenant';
import { OrderSummary } from '@homzhub/common/src/domain/models/OrderSummary';
import { IOrderSummaryPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';

const ENDPOINTS = {
  amenities: 'amenity-categories/',
  tenantPreferences: 'tenant-preferences/',
  orderSummary: 'users/order-summary/',
  valueAddedServices: 'value-added-services/',
};

class RecordAssetRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAmenities = async (): Promise<AssetAmenity[]> => {
    const response = await this.apiClient.get(ENDPOINTS.amenities);
    return ObjectMapper.deserializeArray(AssetAmenity, response);
  };

  public getTenantPreferences = async (asset_id: number): Promise<TenantPreference[]> => {
    const response = await this.apiClient.get(ENDPOINTS.tenantPreferences, { asset_id });
    return ObjectMapper.deserializeArray(TenantPreference, response);
  };

  public getOrderSummary = async (payload: IOrderSummaryPayload): Promise<OrderSummary> => {
    const response = await this.apiClient.post(ENDPOINTS.orderSummary, payload);
    return ObjectMapper.deserialize(OrderSummary, response);
  };

  public getValueAddedServices = async (
    assetGroupId: number,
    countryId: number,
    city: string
  ): Promise<ValueAddedService[]> => {
    const response = await this.apiClient.get(ENDPOINTS.valueAddedServices, {
      asset_group: assetGroupId,
      asset_country: countryId,
      asset_city: city,
    });
    return ObjectMapper.deserializeArray(ValueAddedService, response);
  };
}

const recordAssetRepository = new RecordAssetRepository();
export { recordAssetRepository as RecordAssetRepository };
