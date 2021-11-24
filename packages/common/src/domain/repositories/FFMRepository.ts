import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  onBoarding: 'v1/ffm-onboardings',
  roles: 'v1/roles',
};

class FFMRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding);
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getRoles = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.roles);
    return ObjectMapper.deserializeArray(Unit, response);
  };
}

const ffmRepository = new FFMRepository();
export { ffmRepository as FFMRepository };
