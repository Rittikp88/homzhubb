import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { assetDetail, assetGroups, leaseTermDetail, saleTerm } from '@homzhub/common/src/mocks/PropertyDetails';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';
import { FurnishingType, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

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

  it('should fetch a asset detail', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => assetDetail);
    const response = await PropertyRepository.getAssetById(1);
    expect(response).toMatchSnapshot();
  });

  it('should fetch a lease term', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => leaseTermDetail);
    const response = await PropertyRepository.getLeaseTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create lease term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => ({ id: 5 }));
    const response = await PropertyRepository.createLeaseTerms(1, {
      currency_code: '+91',
      monthly_rent_price: 1200,
      security_deposit_price: 15000,
      annual_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing_status: FurnishingType.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update lease term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await PropertyRepository.updateLeaseTerms(1, 1, {
      currency_code: '+91',
      monthly_rent_price: 1200,
      security_deposit_price: 15000,
      annual_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing_status: FurnishingType.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should fetch a sale term', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => saleTerm);
    const response = await PropertyRepository.getSaleTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create sale term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await PropertyRepository.createSaleTerms(1, {
      currency_code: '+91',
      expected_price: 1200,
      booking_amount: 500,
      year_of_construction: 1,
      available_from_date: '2020-09-12',
      maintenance_amount: 200,
      maintenance_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update sale term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await PropertyRepository.updateSaleTerms(1, 1, {
      currency_code: '+91',
      expected_price: 12000,
      booking_amount: 5000,
      year_of_construction: 1,
      available_from_date: '2020-10-12',
      maintenance_amount: 2000,
      maintenance_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });
});
