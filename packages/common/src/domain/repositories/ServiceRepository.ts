import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

const ENDPOINTS = {
  getAssetPlan: (): string => 'service-category-actions/',
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetPlans = async (): Promise<AssetPlan[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetPlan());
    return ObjectMapper.deserializeArray(AssetPlan, response);
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
