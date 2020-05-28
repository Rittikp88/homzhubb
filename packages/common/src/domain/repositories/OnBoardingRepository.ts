import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IOnboardingData } from '@homzhub/common/src/domain/models/Onboarding';

const ENDPOINTS = {
  allDetail: (): string => 'onboardings',
};

class OnBoardingRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<IOnboardingData[]> => {
    return await this.apiClient.get(ENDPOINTS.allDetail());
  };
}

const onBoardingRepository = new OnBoardingRepository();
export { onBoardingRepository as OnBoardingRepository };
