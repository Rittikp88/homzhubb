import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IFFMVisitParam } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  onBoarding: 'v1/ffm-onboardings',
  roles: 'v1/roles',
  visits: 'v1/ffm/tasks/site-visits/',
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

  public getVisits = async (param?: IFFMVisitParam): Promise<FFMVisit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.visits, param);
    return ObjectMapper.deserializeArray(FFMVisit, response);
  };
}

const ffmRepository = new FFMRepository();
export { ffmRepository as FFMRepository };
