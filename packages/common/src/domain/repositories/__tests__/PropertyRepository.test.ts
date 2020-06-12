import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { assetGroups } from '@homzhub/common/src/mocks/PropertyDetails';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('PropertyRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a asset data', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => assetGroups);
    const response = await PropertyRepository.getDetails();
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of rent services', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => RentServicesData);
    const response = await PropertyRepository.getRentServices();
    expect(response).toMatchSnapshot();
  });

  it('should add a new asset in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => ({ id: 5 }));
    const response = await PropertyRepository.createAsset({
      project_name: 'My House',
      unit_number: '6',
      block_number: 'C1',
      latitude: '1',
      longitude: '1',
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update an existing asset in DB', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'patch').mockImplementation(() => true);
    const response = await PropertyRepository.updateAsset(7, {
      total_floors: 5,
      asset_type: 5,
    });
    expect(response).toBeTruthy();
  });

  [
    { apiName: 'updateAsset', method: 'get' },
    { apiName: 'createAsset', method: 'get' },
    { apiName: 'getRentServices', method: 'get' },
    { apiName: 'getDetails', method: 'get' },
  ].forEach((api: { method: string; apiName: string }) => {
    it(`should throw an error in case of ${api.apiName} API failure`, async () => {
      // @ts-ignore
      jest.spyOn(BootstrapAppService.clientInstance, `${api.method}`).mockImplementation(() => {
        throw new Error('Test Error');
      });
      try {
        // @ts-ignore
        await PropertyRepository[api.apiName]();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });
});
