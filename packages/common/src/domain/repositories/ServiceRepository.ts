import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';

const ENDPOINTS = {
  getServiceSteps: (): string => 'service-categories/services/steps',
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getServiceDetail = (): IServiceDetail[] => {
    return ServicesData;
  };

  public getServiceStepsDetails = async (serviceId: number): Promise<IServiceListStepsDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceSteps(), { service_id: serviceId });
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
