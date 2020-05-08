import { BootstrapAppService } from '../../services/BootstrapAppService';
import { IApiClient } from '../../network/Interfaces';
import { IOwnerRepository } from './Interfaces';

// TODO: Dummy repo for testing purpose, remove once API is ready

const ENDPOINTS = {
  allDetail: () => '/users',
};

class OwnerRepository implements IOwnerRepository {
  get apiClient(): IApiClient {
    return BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<any> => {
    const url = ENDPOINTS.allDetail();
    const response = await this.apiClient.get(url);
    return response;
  };
}

const ownerRepository = new OwnerRepository();
export { ownerRepository as OwnerRepository };
