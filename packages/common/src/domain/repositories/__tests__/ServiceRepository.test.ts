/*eslint-disable*/
// @ts-nocheck
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('ServiceRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should fetch list of all services', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => ServicesData);
    const response = await ServiceRepository.getServiceDetail();
    expect(response).toMatchSnapshot();
  });

  ['getServiceDetail'].forEach((api: string) => {
    it(`should throw an error in case of ${api} API failure`, async () => {
      jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => {
        throw new Error('Test Error');
      });
      try {
        await ServiceRepository[api]();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });
});
