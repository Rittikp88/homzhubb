import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  allDetail: (): string => 'https://jsonplaceholder.typicode.com/todos/1', // TODO: change the url once the api is ready
  getDetailsById: (id: string | number): string => 'https://jsonplaceholder.typicode.com/todos/1',
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<void> => {
    return await this.apiClient.get(ENDPOINTS.allDetail());
  };

  public getDetailsById = async (payload: any): Promise<void> => {
    return await this.apiClient.get(ENDPOINTS.getDetailsById(payload));
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
