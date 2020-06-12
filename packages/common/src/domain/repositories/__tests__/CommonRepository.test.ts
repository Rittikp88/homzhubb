import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { countryCodes, carpetAreaUnits } from '@homzhub/common/src/mocks/CommonRepositoryMocks';

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

  ['getCountryCodes', 'getCarpetAreaUnits'].forEach((api: string) => {
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
  });
});
