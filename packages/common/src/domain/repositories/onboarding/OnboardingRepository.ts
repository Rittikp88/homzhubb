import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IOnboardingRepository, IOnboarding } from '@homzhub/common/src/domain/repositories/onboarding/Interfaces';

const ENDPOINTS = {
  allDetail: (): string => 'onboardings',
};

class OnboardingRepository implements IOnboardingRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<IOnboarding[]> => {
    const url = ENDPOINTS.allDetail();
    return await this.apiClient.get(url);
  };
}

const onboardingRepository = new OnboardingRepository();
export { onboardingRepository as OnboardingRepository };
