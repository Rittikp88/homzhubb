import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { countryCodes, carpetAreaUnits, currencyCodes } from '@homzhub/common/src/mocks/CommonRepositoryMocks';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import { SocialMediaData } from '@homzhub/common/src/mocks/socialMedia';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('CommonRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a list of county codes', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => countryCodes);
    const response = await CommonRepository.getCountryCodes();
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of unit areas', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => carpetAreaUnits);
    const response = await CommonRepository.getCarpetAreaUnits();
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of currency codes', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => currencyCodes);
    const response = await CommonRepository.getCountryCodes();
    expect(response).toMatchSnapshot();
  });

  it('should fetch social media data', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => SocialMediaData);
    const response = await CommonRepository.getSocialMedia();
    expect(response).toMatchSnapshot();
  });

  it('should fetch OnBoarding screen data', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => OnboardingData);
    const response = await CommonRepository.getOnboarding();
    expect(response).toMatchSnapshot();
  });

  ['getCountryCodes', 'getCarpetAreaUnits', 'getOnboarding', 'getCurrencyCodes', 'getSocialMedia'].forEach(
    (api: string) => {
      it(`should throw an error in case of ${api} API failure`, async () => {
        jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => {
          throw new Error('Test Error');
        });
        try {
          // @ts-ignore
          await CommonRepository[api]();
        } catch (e) {
          expect(e).toBeTruthy();
        }
      });
    }
  );
});
