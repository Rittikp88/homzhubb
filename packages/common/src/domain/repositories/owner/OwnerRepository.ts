import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IOwnerRepository } from '@homzhub/common/src/domain/repositories/owner/Interfaces';

// TODO: Dummy repo for testing purpose, remove once API is ready

const ENDPOINTS = {
  allDetail: (): string => '/users',
};

class OwnerRepository implements IOwnerRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<any> => {
    const url = ENDPOINTS.allDetail();
    return await this.apiClient.get(url);
  };
}

const ownerRepository = new OwnerRepository();
export { ownerRepository as OwnerRepository };
