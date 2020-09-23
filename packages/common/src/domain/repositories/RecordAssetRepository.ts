import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetGroupAmenity } from '@homzhub/common/src/domain/models/Amenity';

const ENDPOINTS = {
  amenities: (): string => 'asset-groups/amenities/',
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
}

const recordAssetRepository = new RecordAssetRepository();
export { recordAssetRepository as RecordAssetRepository };
