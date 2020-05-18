import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IOnboardingRepository } from '@homzhub/common/src/domain/repositories/onboarding/Interfaces';

const ENDPOINTS = {
  allDetail: (): string => 'https://jsonplaceholder.typicode.com/users',
};

class OnboardingRepository implements IOnboardingRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getDetails = async (): Promise<any> => {
    const url = ENDPOINTS.allDetail(); // TODO: Replace OnboardingData with url once api is ready
    return await this.apiClient.get(url);
  };
}

const onboardingRepository = new OnboardingRepository();
export { onboardingRepository as OnboardingRepository };
