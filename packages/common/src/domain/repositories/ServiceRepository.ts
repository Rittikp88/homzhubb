import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';

const ENDPOINTS = {
  getRentServices: (): string => 'services/',
  getServiceData: (serviceId: number): string => `service-categories/${serviceId}/services`,
  getServiceSteps: (serviceId: number): string => `service-categories/services/${serviceId}/steps`,
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getRentServices = async (): Promise<IRentServiceList[]> => {
    return await this.apiClient.get(ENDPOINTS.getRentServices());
  };

  public getServiceDetail = async (serviceId: number): Promise<IServiceDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceData(serviceId));
  };

  public getServiceStepsDetails = async (serviceId: number): Promise<IServiceListStepsDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceSteps(serviceId));
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
