import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { ISocietyParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  societies: 'v1/societies/',
};

class PropertyRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocieties = async (param?: ISocietyParam): Promise<Society[]> => {
    const response = await this.apiClient.get(ENDPOINTS.societies, param);
    return ObjectMapper.deserializeArray(Society, response);
  };
}

const propertyRepository = new PropertyRepository();
export { propertyRepository as PropertyRepository };
