import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { AssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';

const ENDPOINTS = {
  getAssetPlan: (): string => 'v2/service-category-actions/',
  getServiceValueBundles: (): string => 'v1/value-bundles/',
  getServicePlatformPlans: (): string => 'v1/service-plans/',
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

  public getServicePlans = async (): Promise<ServicePlans[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getServiceValueBundles());
    return ObjectMapper.deserializeArray(ServicePlans, response);
  };

  public getPlatformPlans = async (): Promise<PlatformPlans[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getServicePlatformPlans());
    return ObjectMapper.deserializeArray(PlatformPlans, response);
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
