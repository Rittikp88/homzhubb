import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetAmenity } from '@homzhub/common/src/domain/models/Amenity';

const ENDPOINTS = {
  amenities: (): string => 'amenities/',
};

class RecordAssetRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAmenities = async (): Promise<AssetAmenity[]> => {
    const response = await this.apiClient.get(ENDPOINTS.amenities());
    return ObjectMapper.deserializeArray(AssetAmenity, response);
  };
}

const recordAssetRepository = new RecordAssetRepository();
export { recordAssetRepository as RecordAssetRepository };
