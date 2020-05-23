import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  allDetail: (): string => 'onboardings',
};

class OnBoardingRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<any> => {
    const url = ENDPOINTS.allDetail();
    return await this.apiClient.get(url);
  };
}

const onBoardingRepository = new OnBoardingRepository();
export { onBoardingRepository as OnBoardingRepository };
