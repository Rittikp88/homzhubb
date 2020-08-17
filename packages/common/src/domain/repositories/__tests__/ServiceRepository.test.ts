/*eslint-disable*/
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('ServiceRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should fetch list of all services', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => ServicesData);
    const response = await ServiceRepository.getServiceDetail(1);
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of rent services', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => RentServicesData);
    const response = await ServiceRepository.getRentServices();
    expect(response).toMatchSnapshot();
  });

  ['getServiceDetail'].forEach((api: string) => {
    it(`should throw an error in case of ${api} API failure`, async () => {
      jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => {
        throw new Error('Test Error');
      });
      try {
        // @ts-ignore
        await ServiceRepository[api]();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  it('Should fetch service steps details', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => ServiceSteps);
    const response = await ServiceRepository.getServiceStepsDetails(1, 1);
    expect(response).toMatchSnapshot();
  });
});
