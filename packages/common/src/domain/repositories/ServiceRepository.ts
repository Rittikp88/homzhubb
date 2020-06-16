import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';
import { IServiceParam } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getServiceData: (): string => 'service-categories/services/',
  getServiceSteps: (): string => 'service-categories/services/steps',
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getServiceDetail = async (param: IServiceParam): Promise<IServiceDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceData(), param);
  };

  public getServiceStepsDetails = async (serviceId: number): Promise<IServiceListStepsDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceSteps(), { service_id: serviceId });
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
