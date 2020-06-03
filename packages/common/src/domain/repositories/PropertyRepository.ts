import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

const ENDPOINTS = {
  getPropertyDetails: (): string => 'asset-groups/',
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<IPropertyDetailsData[]> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyDetails());
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
