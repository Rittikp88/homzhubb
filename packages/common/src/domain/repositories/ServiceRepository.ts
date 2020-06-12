import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getServiceDetail = (): IServiceDetail[] => {
    return ServicesData;
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
