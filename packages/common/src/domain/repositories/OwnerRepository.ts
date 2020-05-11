import { BootstrapAppService } from '../../services/BootstrapAppService';
import { IApiClient } from '../../network/Interfaces';
import { IOwnerRepository } from './Interfaces';

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
